import { apiClient, ApiResponse } from './api';

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp?: string;
  userId?: string;
  sessionId?: string;
  deviceInfo?: DeviceInfo;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  timezone: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isOnline: boolean;
}

export interface UserMetrics {
  totalBookmarks: number;
  totalCollections: number;
  totalSearches: number;
  avgBookmarksPerMonth: number;
  mostUsedTags: Array<{ tag: string; count: number }>;
  topDomains: Array<{ domain: string; count: number }>;
  activityScore: number;
  streak: {
    current: number;
    longest: number;
  };
  joinedDate: string;
  lastActiveDate: string;
}

export interface AppMetrics {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  totalUsers: number;
  totalBookmarks: number;
  totalSearches: number;
  avgSessionDuration: number;
  bounceRate: number;
  retentionRate: {
    day1: number;
    day7: number;
    day30: number;
  };
  topFeatures: Array<{ feature: string; usage: number }>;
  errorRate: number;
  performanceMetrics: {
    avgLoadTime: number;
    avgResponseTime: number;
    crashRate: number;
  };
}

export interface TimeSeriesData {
  date: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface FunnelData {
  step: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
}

// Analytics Service Class
class AnalyticsService {
  private sessionId: string;
  private userId: string | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeAnalytics();
    this.setupEventListeners();
    this.startAutoFlush();
  }

  // Initialization
  private initializeAnalytics(): void {
    // Check if analytics is enabled in settings
    const settings = localStorage.getItem('spark-settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      this.isEnabled = parsed.privacy?.analytics !== false;
    }

    // Get user ID if available
    const userData = localStorage.getItem('user-data');
    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user.id;
    }

    // Track page load
    this.track('page_load', {
      url: window.location.href,
      referrer: document.referrer,
      loadTime: performance.now()
    });
  }

  private setupEventListeners(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden');
      } else {
        this.track('page_visible');
      }
    });

    // Track beforeunload
    window.addEventListener('beforeunload', () => {
      this.track('page_unload');
      this.flush(true); // Force flush on unload
    });

    // Track errors
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    });
  }

  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  // Core Tracking Methods
  track(event: string, properties: Record<string, any> = {}): void {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        url: window.location.href,
        path: window.location.pathname,
        search: window.location.search
      },
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      deviceInfo: this.getDeviceInfo()
    };

    this.eventQueue.push(analyticsEvent);

    // Flush if queue is full
    if (this.eventQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  trackPageView(path?: string, properties: Record<string, any> = {}): void {
    this.track('page_view', {
      path: path || window.location.pathname,
      title: document.title,
      ...properties
    });
  }

  trackUserAction(action: string, target: string, properties: Record<string, any> = {}): void {
    this.track('user_action', {
      action,
      target,
      ...properties
    });
  }

  trackSearch(query: string, resultsCount: number, filters: Record<string, any> = {}): void {
    this.track('search', {
      query: query.length > 100 ? query.substring(0, 100) + '...' : query,
      resultsCount,
      queryLength: query.length,
      hasFilters: Object.keys(filters).length > 0,
      filters
    });
  }

  trackBookmarkAction(action: 'create' | 'update' | 'delete' | 'view', bookmarkId: string, properties: Record<string, any> = {}): void {
    this.track('bookmark_action', {
      action,
      bookmarkId,
      ...properties
    });
  }

  trackFeatureUsage(feature: string, properties: Record<string, any> = {}): void {
    this.track('feature_usage', {
      feature,
      ...properties
    });
  }

  trackPerformance(metric: string, value: number, properties: Record<string, any> = {}): void {
    this.track('performance', {
      metric,
      value,
      ...properties
    });
  }

  trackError(type: string, errorDetails: Record<string, any>): void {
    this.track('error', {
      errorType: type,
      ...errorDetails,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  trackConversion(funnel: string, step: string, properties: Record<string, any> = {}): void {
    this.track('conversion', {
      funnel,
      step,
      ...properties
    });
  }

  // Session Management
  identify(userId: string, traits: Record<string, any> = {}): void {
    this.userId = userId;
    this.track('identify', {
      userId,
      traits
    });
  }

  startSession(): void {
    this.sessionId = this.generateSessionId();
    this.track('session_start');
  }

  endSession(): void {
    this.track('session_end');
    this.flush(true);
  }

  // Data Retrieval
  async getUserMetrics(userId?: string, timeRange: 'week' | 'month' | 'year' = 'month'): Promise<UserMetrics> {
    const response = await apiClient.get<UserMetrics>('/analytics/user-metrics', {
      userId: userId || this.userId,
      timeRange
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch user metrics');
  }

  async getAppMetrics(timeRange: 'week' | 'month' | 'year' = 'month'): Promise<AppMetrics> {
    const response = await apiClient.get<AppMetrics>('/analytics/app-metrics', {
      timeRange
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch app metrics');
  }

  async getTimeSeriesData(metric: string, timeRange: 'week' | 'month' | 'year' = 'month'): Promise<TimeSeriesData[]> {
    const response = await apiClient.get<TimeSeriesData[]>('/analytics/time-series', {
      metric,
      timeRange
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch time series data');
  }

  async getFunnelData(funnel: string, timeRange: 'week' | 'month' | 'year' = 'month'): Promise<FunnelData[]> {
    const response = await apiClient.get<FunnelData[]>('/analytics/funnel', {
      funnel,
      timeRange
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch funnel data');
  }

  async getTopEvents(limit: number = 10, timeRange: 'week' | 'month' | 'year' = 'month'): Promise<Array<{ event: string; count: number }>> {
    const response = await apiClient.get<Array<{ event: string; count: number }>>('/analytics/top-events', {
      limit,
      timeRange
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch top events');
  }

  // Real-time Analytics
  async getRealTimeMetrics(): Promise<{
    activeUsers: number;
    currentSessions: number;
    eventsPerMinute: number;
    topPages: Array<{ path: string; users: number }>;
    topEvents: Array<{ event: string; count: number }>;
  }> {
    const response = await apiClient.get<any>('/analytics/real-time');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch real-time metrics');
  }

  // Data Export
  async exportAnalyticsData(format: 'csv' | 'json', filters: Record<string, any> = {}): Promise<Blob> {
    const response = await fetch(`${apiClient['baseURL']}/analytics/export?${new URLSearchParams({
      format,
      ...filters
    })}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
      },
    });

    if (response.ok) {
      return response.blob();
    }

    throw new Error('Failed to export analytics data');
  }

  // Privacy and GDPR
  async deleteUserData(userId?: string): Promise<void> {
    const response = await apiClient.delete('/analytics/user-data', {
      userId: userId || this.userId
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete user data');
    }
  }

  async getDataRetentionInfo(): Promise<{
    retentionPeriod: number;
    dataTypes: string[];
    deletionSchedule: string;
  }> {
    const response = await apiClient.get<any>('/analytics/data-retention');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch data retention info');
  }

  // Configuration
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.eventQueue = [];
    }
  }

  setBatchSize(size: number): void {
    this.batchSize = size;
  }

  setFlushInterval(interval: number): void {
    this.flushInterval = interval;
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.startAutoFlush();
  }

  // Private Methods
  private async flush(force: boolean = false): Promise<void> {
    if (!this.isEnabled || this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await apiClient.post('/analytics/events', {
        events,
        force
      });

      if (!response.success) {
        // If failed, add events back to queue for retry
        this.eventQueue.unshift(...events);
        console.error('Failed to send analytics events:', response.error);
      }
    } catch (error) {
      // If failed, add events back to queue for retry
      this.eventQueue.unshift(...events);
      console.error('Failed to send analytics events:', error);
    }
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): DeviceInfo {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      deviceType: this.getDeviceType(),
      isOnline: navigator.onLine
    };
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    if (/Mobi|Android/i.test(userAgent)) {
      return 'mobile';
    } else if (/Tablet|iPad/i.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  // Cleanup
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(true);
    this.eventQueue = [];
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Convenience functions for common tracking scenarios
export const trackPageView = (path?: string, properties?: Record<string, any>) => 
  analyticsService.trackPageView(path, properties);

export const trackClick = (element: string, properties?: Record<string, any>) => 
  analyticsService.trackUserAction('click', element, properties);

export const trackSearch = (query: string, resultsCount: number, filters?: Record<string, any>) => 
  analyticsService.trackSearch(query, resultsCount, filters);

export const trackBookmark = (action: 'create' | 'update' | 'delete' | 'view', bookmarkId: string, properties?: Record<string, any>) => 
  analyticsService.trackBookmarkAction(action, bookmarkId, properties);

export const trackFeature = (feature: string, properties?: Record<string, any>) => 
  analyticsService.trackFeatureUsage(feature, properties);

export const trackError = (type: string, errorDetails: Record<string, any>) => 
  analyticsService.trackError(type, errorDetails);