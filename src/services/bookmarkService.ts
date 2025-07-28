import { apiClient, ApiResponse, PaginatedResponse } from './api';

// Bookmark Types
export interface Bookmark {
  id: string;
  userId: string;
  title: string;
  url: string;
  description?: string;
  content?: string;
  domain: string;
  tags: string[];
  collections: string[];
  metadata: {
    favicon?: string;
    image?: string;
    siteName?: string;
    author?: string;
    publishedDate?: string;
    readingTime?: number;
  };
  isPrivate: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isPrivate: boolean;
  bookmarkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookmarkData {
  url: string;
  title?: string;
  description?: string;
  tags?: string[];
  collections?: string[];
  isPrivate?: boolean;
}

export interface UpdateBookmarkData {
  title?: string;
  description?: string;
  tags?: string[];
  collections?: string[];
  isPrivate?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
}

export interface CreateCollectionData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isPrivate?: boolean;
}

export interface BookmarkFilters {
  search?: string;
  tags?: string[];
  collections?: string[];
  domain?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'lastAccessedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Bookmark Service Class
class BookmarkService {
  // Bookmark CRUD Operations
  async createBookmark(data: CreateBookmarkData): Promise<Bookmark> {
    const response = await apiClient.post<Bookmark>('/bookmarks', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create bookmark');
  }

  async getBookmarks(filters?: BookmarkFilters): Promise<PaginatedResponse<Bookmark>> {
    const response = await apiClient.get<Bookmark[]>('/bookmarks', filters);
    
    if (response.success) {
      return response as PaginatedResponse<Bookmark>;
    }
    
    throw new Error(response.error || 'Failed to fetch bookmarks');
  }

  async getBookmark(id: string): Promise<Bookmark> {
    const response = await apiClient.get<Bookmark>(`/bookmarks/${id}`);
    
    if (response.success && response.data) {
      // Track access
      this.trackAccess(id);
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch bookmark');
  }

  async updateBookmark(id: string, data: UpdateBookmarkData): Promise<Bookmark> {
    const response = await apiClient.patch<Bookmark>(`/bookmarks/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update bookmark');
  }

  async deleteBookmark(id: string): Promise<void> {
    const response = await apiClient.delete(`/bookmarks/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete bookmark');
    }
  }

  async bulkDeleteBookmarks(ids: string[]): Promise<void> {
    const response = await apiClient.post('/bookmarks/bulk-delete', { ids });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete bookmarks');
    }
  }

  // Collection Operations
  async createCollection(data: CreateCollectionData): Promise<Collection> {
    const response = await apiClient.post<Collection>('/collections', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create collection');
  }

  async getCollections(): Promise<Collection[]> {
    const response = await apiClient.get<Collection[]>('/collections');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch collections');
  }

  async getCollection(id: string): Promise<Collection> {
    const response = await apiClient.get<Collection>(`/collections/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch collection');
  }

  async updateCollection(id: string, data: Partial<CreateCollectionData>): Promise<Collection> {
    const response = await apiClient.patch<Collection>(`/collections/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update collection');
  }

  async deleteCollection(id: string): Promise<void> {
    const response = await apiClient.delete(`/collections/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete collection');
    }
  }

  // Search and Discovery
  async searchBookmarks(query: string, filters?: Omit<BookmarkFilters, 'search'>): Promise<PaginatedResponse<Bookmark>> {
    const searchFilters = { ...filters, search: query };
    return this.getBookmarks(searchFilters);
  }

  async getSimilarBookmarks(id: string, limit: number = 5): Promise<Bookmark[]> {
    const response = await apiClient.get<Bookmark[]>(`/bookmarks/${id}/similar`, { limit });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch similar bookmarks');
  }

  async getPopularTags(limit: number = 20): Promise<Array<{ tag: string; count: number }>> {
    const response = await apiClient.get<Array<{ tag: string; count: number }>>('/tags/popular', { limit });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch popular tags');
  }

  // URL Processing
  async extractMetadata(url: string): Promise<Bookmark['metadata']> {
    const response = await apiClient.post<Bookmark['metadata']>('/bookmarks/extract-metadata', { url });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to extract metadata');
  }

  async checkUrlExists(url: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ exists: boolean }>('/bookmarks/check-url', { url });
      return response.data?.exists || false;
    } catch (error) {
      return false;
    }
  }

  // Import/Export
  async importBookmarks(file: File, format: 'html' | 'json' | 'csv'): Promise<{ imported: number; failed: number }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    const response = await fetch(`${apiClient['baseURL']}/bookmarks/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      return data.data;
    }
    
    throw new Error(data.error || 'Failed to import bookmarks');
  }

  async exportBookmarks(format: 'html' | 'json' | 'csv', filters?: BookmarkFilters): Promise<Blob> {
    const response = await fetch(`${apiClient['baseURL']}/bookmarks/export?${new URLSearchParams({
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
    
    throw new Error('Failed to export bookmarks');
  }

  // Analytics
  async getBookmarkStats(): Promise<{
    total: number;
    favorites: number;
    archived: number;
    collections: number;
    tags: number;
    thisMonth: number;
    thisWeek: number;
  }> {
    const response = await apiClient.get<any>('/bookmarks/stats');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch stats');
  }

  async getActivityData(days: number = 30): Promise<Array<{ date: string; count: number }>> {
    const response = await apiClient.get<Array<{ date: string; count: number }>>('/bookmarks/activity', { days });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch activity data');
  }

  // Private Methods
  private async trackAccess(bookmarkId: string): Promise<void> {
    try {
      await apiClient.post(`/bookmarks/${bookmarkId}/access`);
    } catch (error) {
      // Fail silently for access tracking
      console.warn('Failed to track bookmark access:', error);
    }
  }
}

export const bookmarkService = new BookmarkService();