import { apiClient, ApiResponse, PaginatedResponse } from './api';
import { Bookmark } from './bookmarkService';

// Search Types
export interface SearchFilters {
  query?: string;
  tags?: string[];
  collections?: string[];
  domains?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  contentType?: 'all' | 'articles' | 'videos' | 'images' | 'documents';
  sortBy?: 'relevance' | 'date' | 'title' | 'domain';
  sortOrder?: 'asc' | 'desc';
  includeContent?: boolean;
  fuzzySearch?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  bookmark: Bookmark;
  score: number;
  highlights: {
    title?: string[];
    description?: string[];
    content?: string[];
    tags?: string[];
  };
  matchedFields: string[];
}

export interface SearchSuggestion {
  type: 'query' | 'tag' | 'domain' | 'collection';
  value: string;
  count: number;
  description?: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: SearchFilters;
  isAlert: boolean;
  alertFrequency?: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
}

export interface SearchAnalytics {
  totalSearches: number;
  popularQueries: Array<{ query: string; count: number }>;
  popularTags: Array<{ tag: string; count: number }>;
  popularDomains: Array<{ domain: string; count: number }>;
  searchTrends: Array<{ date: string; searches: number }>;
  avgResultsPerSearch: number;
  clickThroughRate: number;
}

// Search Service Class
class SearchService {
  // Core Search Functionality
  async search(filters: SearchFilters): Promise<PaginatedResponse<SearchResult>> {
    const response = await apiClient.post<SearchResult[]>('/search', filters);
    
    if (response.success) {
      // Track search analytics
      this.trackSearch(filters);
      return response as PaginatedResponse<SearchResult>;
    }
    
    throw new Error(response.error || 'Search failed');
  }

  async quickSearch(query: string, limit: number = 10): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>('/search/quick', { 
      query, 
      limit,
      includeContent: false 
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Quick search failed');
  }

  async fullTextSearch(query: string, filters?: Omit<SearchFilters, 'query'>): Promise<PaginatedResponse<SearchResult>> {
    return this.search({ 
      ...filters, 
      query, 
      includeContent: true,
      fuzzySearch: true 
    });
  }

  // Search Suggestions
  async getSuggestions(query: string, limit: number = 10): Promise<SearchSuggestion[]> {
    const response = await apiClient.get<SearchSuggestion[]>('/search/suggestions', { 
      query, 
      limit 
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  async getAutocompleteSuggestions(query: string, type?: 'query' | 'tag' | 'domain'): Promise<string[]> {
    const response = await apiClient.get<string[]>('/search/autocomplete', { 
      query, 
      type 
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  // Advanced Search
  async semanticSearch(query: string, filters?: SearchFilters): Promise<PaginatedResponse<SearchResult>> {
    const response = await apiClient.post<SearchResult[]>('/search/semantic', {
      ...filters,
      query
    });
    
    if (response.success) {
      return response as PaginatedResponse<SearchResult>;
    }
    
    throw new Error(response.error || 'Semantic search failed');
  }

  async similarContent(bookmarkId: string, limit: number = 5): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>(`/search/similar/${bookmarkId}`, { 
      limit 
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Similar content search failed');
  }

  async findDuplicates(threshold: number = 0.8): Promise<Array<{ original: Bookmark; duplicates: Bookmark[] }>> {
    const response = await apiClient.get<Array<{ original: Bookmark; duplicates: Bookmark[] }>>('/search/duplicates', { 
      threshold 
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Duplicate detection failed');
  }

  // Saved Searches
  async createSavedSearch(data: Omit<SavedSearch, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SavedSearch> {
    const response = await apiClient.post<SavedSearch>('/search/saved', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create saved search');
  }

  async getSavedSearches(): Promise<SavedSearch[]> {
    const response = await apiClient.get<SavedSearch[]>('/search/saved');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch saved searches');
  }

  async runSavedSearch(id: string): Promise<PaginatedResponse<SearchResult>> {
    const response = await apiClient.post<SearchResult[]>(`/search/saved/${id}/run`);
    
    if (response.success) {
      return response as PaginatedResponse<SearchResult>;
    }
    
    throw new Error(response.error || 'Failed to run saved search');
  }

  async updateSavedSearch(id: string, data: Partial<SavedSearch>): Promise<SavedSearch> {
    const response = await apiClient.patch<SavedSearch>(`/search/saved/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update saved search');
  }

  async deleteSavedSearch(id: string): Promise<void> {
    const response = await apiClient.delete(`/search/saved/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete saved search');
    }
  }

  // Search Analytics
  async getSearchAnalytics(days: number = 30): Promise<SearchAnalytics> {
    const response = await apiClient.get<SearchAnalytics>('/search/analytics', { days });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch search analytics');
  }

  async getPopularSearches(limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    const response = await apiClient.get<Array<{ query: string; count: number }>>('/search/popular', { 
      limit 
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  // Search History
  async getSearchHistory(limit: number = 50): Promise<Array<{ query: string; timestamp: string; resultsCount: number }>> {
    const response = await apiClient.get<Array<{ query: string; timestamp: string; resultsCount: number }>>('/search/history', { 
      limit 
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  async clearSearchHistory(): Promise<void> {
    const response = await apiClient.delete('/search/history');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to clear search history');
    }
  }

  // Search Index Management
  async rebuildSearchIndex(): Promise<{ message: string; estimatedTime: number }> {
    const response = await apiClient.post<{ message: string; estimatedTime: number }>('/search/reindex');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to rebuild search index');
  }

  async getIndexStatus(): Promise<{
    status: 'healthy' | 'rebuilding' | 'error';
    totalDocuments: number;
    lastUpdated: string;
    size: string;
  }> {
    const response = await apiClient.get<any>('/search/index/status');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get index status');
  }

  // Filters and Facets
  async getAvailableFilters(): Promise<{
    tags: Array<{ name: string; count: number }>;
    domains: Array<{ name: string; count: number }>;
    collections: Array<{ name: string; count: number }>;
    contentTypes: Array<{ name: string; count: number }>;
    dateRanges: Array<{ name: string; from: string; to: string }>;
  }> {
    const response = await apiClient.get<any>('/search/filters');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch available filters');
  }

  // Private Methods
  private async trackSearch(filters: SearchFilters): Promise<void> {
    try {
      await apiClient.post('/search/track', {
        query: filters.query,
        filters: filters,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Fail silently for analytics tracking
      console.warn('Failed to track search:', error);
    }
  }

  async trackSearchResult(searchId: string, bookmarkId: string, position: number): Promise<void> {
    try {
      await apiClient.post('/search/track-result', {
        searchId,
        bookmarkId,
        position,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Fail silently for analytics tracking
      console.warn('Failed to track search result click:', error);
    }
  }
}

export const searchService = new SearchService();