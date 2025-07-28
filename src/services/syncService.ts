import { apiClient, ApiResponse } from './api';
import { Bookmark, Collection } from './bookmarkService';
import { User } from './authService';

// Sync Types
export interface SyncStatus {
  isOnline: boolean;
  lastSyncAt: string | null;
  pendingChanges: number;
  isSyncing: boolean;
  syncProgress: number;
  conflicts: number;
}

export interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'bookmark' | 'collection' | 'user';
  entityId: string;
  data: any;
  timestamp: string;
  userId: string;
  deviceId: string;
  conflictResolved?: boolean;
}

export interface ConflictResolution {
  conflictId: string;
  resolution: 'keep_local' | 'keep_remote' | 'merge';
  mergedData?: any;
}

export interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // in seconds
  retryAttempts: number;
  batchSize: number;
  conflictResolution: 'ask_user' | 'keep_local' | 'keep_remote' | 'auto_merge';
}

// Real-time Synchronization Service
class SyncService {
  private ws: WebSocket | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private eventQueue: SyncEvent[] = [];
  private listeners: Map<string, Set<Function>> = new Map();
  private config: SyncConfig = {
    autoSync: true,
    syncInterval: 30, // 30 seconds
    retryAttempts: 3,
    batchSize: 50,
    conflictResolution: 'ask_user'
  };

  constructor() {
    this.initializeSync();
    this.setupNetworkListeners();
  }

  // Initialization
  private initializeSync(): void {
    // Load sync config from settings
    const savedConfig = localStorage.getItem('sync-config');
    if (savedConfig) {
      this.config = { ...this.config, ...JSON.parse(savedConfig) };
    }

    // Start auto-sync if enabled
    if (this.config.autoSync) {
      this.startAutoSync();
    }

    // Connect to WebSocket for real-time updates
    this.connectWebSocket();
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.emit('status-change', { isOnline: true });
      this.syncPendingChanges();
    });

    window.addEventListener('offline', () => {
      this.emit('status-change', { isOnline: false });
    });
  }

  // WebSocket Connection
  private connectWebSocket(): void {
    const token = localStorage.getItem('auth-token');
    if (!token) return;

    const wsUrl = `${apiClient['baseURL'].replace('http', 'ws')}/ws?token=${token}`;
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealTimeUpdate(data);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.emit('disconnected');
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          this.connectWebSocket();
        }, 5000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  private handleRealTimeUpdate(data: any): void {
    switch (data.type) {
      case 'bookmark_updated':
        this.emit('bookmark-updated', data.bookmark);
        break;
      case 'collection_updated':
        this.emit('collection-updated', data.collection);
        break;
      case 'sync_required':
        this.performSync();
        break;
      case 'conflict_detected':
        this.handleConflict(data.conflict);
        break;
    }
  }

  // Auto Sync
  startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (navigator.onLine && this.config.autoSync) {
        this.performSync();
      }
    }, this.config.syncInterval * 1000);
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Core Sync Operations
  async performSync(): Promise<void> {
    if (!navigator.onLine) {
      throw new Error('Cannot sync while offline');
    }

    this.emit('sync-started');

    try {
      // 1. Upload pending changes
      await this.uploadPendingChanges();

      // 2. Download remote changes
      await this.downloadRemoteChanges();

      // 3. Resolve conflicts
      await this.resolveConflicts();

      // 4. Update last sync timestamp
      const now = new Date().toISOString();
      localStorage.setItem('last-sync', now);

      this.emit('sync-completed', { timestamp: now });
    } catch (error) {
      this.emit('sync-failed', error);
      throw error;
    }
  }

  private async uploadPendingChanges(): Promise<void> {
    const pendingEvents = this.getPendingEvents();
    
    if (pendingEvents.length === 0) return;

    // Process in batches
    for (let i = 0; i < pendingEvents.length; i += this.config.batchSize) {
      const batch = pendingEvents.slice(i, i + this.config.batchSize);
      
      try {
        const response = await apiClient.post<{ processed: string[]; conflicts: any[] }>('/sync/upload', {
          events: batch
        });

        if (response.success && response.data) {
          // Remove successfully processed events
          this.removeProcessedEvents(response.data.processed);
          
          // Handle conflicts
          if (response.data.conflicts.length > 0) {
            this.handleConflicts(response.data.conflicts);
          }
        }
      } catch (error) {
        console.error('Failed to upload batch:', error);
        throw error;
      }

      // Update progress
      const progress = Math.min(100, ((i + batch.length) / pendingEvents.length) * 50);
      this.emit('sync-progress', progress);
    }
  }

  private async downloadRemoteChanges(): Promise<void> {
    const lastSync = localStorage.getItem('last-sync') || '1970-01-01T00:00:00.000Z';
    
    try {
      const response = await apiClient.get<{
        events: SyncEvent[];
        hasMore: boolean;
        nextCursor?: string;
      }>('/sync/download', {
        since: lastSync,
        limit: this.config.batchSize
      });

      if (response.success && response.data) {
        await this.applyRemoteChanges(response.data.events);
        
        // Update progress
        this.emit('sync-progress', 75);

        // Handle pagination if needed
        let cursor = response.data.nextCursor;
        while (response.data.hasMore && cursor) {
          const nextResponse = await apiClient.get<{
            events: SyncEvent[];
            hasMore: boolean;
            nextCursor?: string;
          }>('/sync/download', {
            cursor,
            limit: this.config.batchSize
          });

          if (nextResponse.success && nextResponse.data) {
            await this.applyRemoteChanges(nextResponse.data.events);
            cursor = nextResponse.data.nextCursor;
          } else {
            break;
          }
        }
      }
    } catch (error) {
      console.error('Failed to download remote changes:', error);
      throw error;
    }
  }

  private async applyRemoteChanges(events: SyncEvent[]): Promise<void> {
    for (const event of events) {
      try {
        await this.applyRemoteEvent(event);
      } catch (error) {
        console.error('Failed to apply remote event:', event, error);
      }
    }
  }

  private async applyRemoteEvent(event: SyncEvent): Promise<void> {
    const localData = await this.getLocalData(event.entity, event.entityId);
    
    if (localData && this.hasLocalChanges(event.entityId)) {
      // Conflict detected
      this.addConflict({
        id: `${event.entityId}-${Date.now()}`,
        type: event.type,
        entity: event.entity,
        entityId: event.entityId,
        localData,
        remoteData: event.data,
        remoteEvent: event
      });
    } else {
      // No conflict, apply change
      await this.updateLocalData(event.entity, event.entityId, event.data, event.type);
      this.emit(`${event.entity}-${event.type}`, { id: event.entityId, data: event.data });
    }
  }

  // Conflict Resolution
  private async resolveConflicts(): Promise<void> {
    const conflicts = this.getUnresolvedConflicts();
    
    for (const conflict of conflicts) {
      try {
        await this.resolveConflict(conflict);
      } catch (error) {
        console.error('Failed to resolve conflict:', conflict, error);
      }
    }

    this.emit('sync-progress', 100);
  }

  private async resolveConflict(conflict: any): Promise<void> {
    let resolution: ConflictResolution;

    switch (this.config.conflictResolution) {
      case 'keep_local':
        resolution = { conflictId: conflict.id, resolution: 'keep_local' };
        break;
      case 'keep_remote':
        resolution = { conflictId: conflict.id, resolution: 'keep_remote' };
        break;
      case 'auto_merge':
        const merged = this.autoMergeData(conflict.localData, conflict.remoteData);
        resolution = { 
          conflictId: conflict.id, 
          resolution: 'merge', 
          mergedData: merged 
        };
        break;
      case 'ask_user':
      default:
        // Emit conflict for user resolution
        this.emit('conflict-detected', conflict);
        return; // Don't auto-resolve
    }

    await this.applyConflictResolution(resolution);
  }

  async resolveConflictManually(resolution: ConflictResolution): Promise<void> {
    await this.applyConflictResolution(resolution);
    this.removeConflict(resolution.conflictId);
  }

  private async applyConflictResolution(resolution: ConflictResolution): Promise<void> {
    const conflict = this.getConflict(resolution.conflictId);
    if (!conflict) return;

    let finalData: any;

    switch (resolution.resolution) {
      case 'keep_local':
        finalData = conflict.localData;
        break;
      case 'keep_remote':
        finalData = conflict.remoteData;
        break;
      case 'merge':
        finalData = resolution.mergedData;
        break;
    }

    // Update local data
    await this.updateLocalData(
      conflict.entity, 
      conflict.entityId, 
      finalData, 
      'update'
    );

    // Queue for upload to server
    this.queueSyncEvent({
      id: `${conflict.entityId}-${Date.now()}`,
      type: 'update',
      entity: conflict.entity,
      entityId: conflict.entityId,
      data: finalData,
      timestamp: new Date().toISOString(),
      userId: '', // Will be set by server
      deviceId: this.getDeviceId()
    });
  }

  // Data Operations
  private async getLocalData(entity: string, id: string): Promise<any> {
    // This would integrate with local storage/IndexedDB
    switch (entity) {
      case 'bookmark':
        return JSON.parse(localStorage.getItem(`bookmark-${id}`) || 'null');
      case 'collection':
        return JSON.parse(localStorage.getItem(`collection-${id}`) || 'null');
      default:
        return null;
    }
  }

  private async updateLocalData(entity: string, id: string, data: any, type: string): Promise<void> {
    switch (entity) {
      case 'bookmark':
        if (type === 'delete') {
          localStorage.removeItem(`bookmark-${id}`);
        } else {
          localStorage.setItem(`bookmark-${id}`, JSON.stringify(data));
        }
        break;
      case 'collection':
        if (type === 'delete') {
          localStorage.removeItem(`collection-${id}`);
        } else {
          localStorage.setItem(`collection-${id}`, JSON.stringify(data));
        }
        break;
    }
  }

  // Event Queue Management
  queueSyncEvent(event: Partial<SyncEvent>): void {
    const fullEvent: SyncEvent = {
      id: event.id || `${event.entityId}-${Date.now()}`,
      type: event.type!,
      entity: event.entity!,
      entityId: event.entityId!,
      data: event.data,
      timestamp: event.timestamp || new Date().toISOString(),
      userId: event.userId || '',
      deviceId: event.deviceId || this.getDeviceId()
    };

    this.eventQueue.push(fullEvent);
    this.saveEventQueue();
    this.emit('pending-changes', this.eventQueue.length);
  }

  private getPendingEvents(): SyncEvent[] {
    const saved = localStorage.getItem('sync-event-queue');
    if (saved) {
      this.eventQueue = JSON.parse(saved);
    }
    return this.eventQueue;
  }

  private saveEventQueue(): void {
    localStorage.setItem('sync-event-queue', JSON.stringify(this.eventQueue));
  }

  private removeProcessedEvents(eventIds: string[]): void {
    this.eventQueue = this.eventQueue.filter(event => !eventIds.includes(event.id));
    this.saveEventQueue();
  }

  // Utility Methods
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('device-id');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device-id', deviceId);
    }
    return deviceId;
  }

  private autoMergeData(local: any, remote: any): any {
    // Simple merge strategy - can be enhanced
    return {
      ...local,
      ...remote,
      updatedAt: new Date().toISOString()
    };
  }

  private hasLocalChanges(entityId: string): boolean {
    return this.eventQueue.some(event => event.entityId === entityId);
  }

  // Conflict Management (placeholder - would use proper storage)
  private addConflict(conflict: any): void {
    const conflicts = this.getUnresolvedConflicts();
    conflicts.push(conflict);
    localStorage.setItem('sync-conflicts', JSON.stringify(conflicts));
  }

  private getUnresolvedConflicts(): any[] {
    const saved = localStorage.getItem('sync-conflicts');
    return saved ? JSON.parse(saved) : [];
  }

  private getConflict(id: string): any {
    return this.getUnresolvedConflicts().find(c => c.id === id);
  }

  private removeConflict(id: string): void {
    const conflicts = this.getUnresolvedConflicts().filter(c => c.id !== id);
    localStorage.setItem('sync-conflicts', JSON.stringify(conflicts));
  }

  private handleConflicts(conflicts: any[]): void {
    conflicts.forEach(conflict => this.addConflict(conflict));
  }

  private handleConflict(conflict: any): void {
    this.addConflict(conflict);
    this.emit('conflict-detected', conflict);
  }

  // Event System
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Public API
  async forcSync(): Promise<void> {
    return this.performSync();
  }

  getSyncStatus(): SyncStatus {
    return {
      isOnline: navigator.onLine,
      lastSyncAt: localStorage.getItem('last-sync'),
      pendingChanges: this.eventQueue.length,
      isSyncing: false, // Would track actual sync state
      syncProgress: 0,
      conflicts: this.getUnresolvedConflicts().length
    };
  }

  updateSyncConfig(newConfig: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('sync-config', JSON.stringify(this.config));
    
    if (this.config.autoSync) {
      this.startAutoSync();
    } else {
      this.stopAutoSync();
    }
  }

  async syncPendingChanges(): Promise<void> {
    if (this.eventQueue.length > 0) {
      await this.uploadPendingChanges();
    }
  }

  // Cleanup
  destroy(): void {
    this.stopAutoSync();
    if (this.ws) {
      this.ws.close();
    }
    this.listeners.clear();
  }
}

export const syncService = new SyncService();