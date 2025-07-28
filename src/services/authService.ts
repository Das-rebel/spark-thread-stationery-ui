import { apiClient, ApiResponse } from './api';

// Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  displayName: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Auth Service Class
class AuthService {
  private readonly TOKEN_KEY = 'auth-token';
  private readonly REFRESH_TOKEN_KEY = 'refresh-token';
  private readonly USER_KEY = 'user-data';

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      this.setTokens(response.data.tokens);
      this.setUser(response.data.user);
      return response.data;
    }
    
    throw new Error(response.error || 'Login failed');
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    if (response.success && response.data) {
      this.setTokens(response.data.tokens);
      this.setUser(response.data.user);
      return response.data;
    }
    
    throw new Error(response.error || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearAuth();
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthTokens>('/auth/refresh', {
      refreshToken
    });

    if (response.success && response.data) {
      this.setTokens(response.data);
      return response.data;
    }

    throw new Error(response.error || 'Token refresh failed');
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    
    if (response.success && response.data) {
      this.setUser(response.data);
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get user data');
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>('/auth/profile', updates);
    
    if (response.success && response.data) {
      this.setUser(response.data);
      return response.data;
    }
    
    throw new Error(response.error || 'Profile update failed');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    });

    if (!response.success) {
      throw new Error(response.error || 'Password change failed');
    }
  }

  async resetPassword(email: string): Promise<void> {
    const response = await apiClient.post('/auth/reset-password', { email });

    if (!response.success) {
      throw new Error(response.error || 'Password reset failed');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const response = await apiClient.post('/auth/verify-email', { token });

    if (!response.success) {
      throw new Error(response.error || 'Email verification failed');
    }
  }

  // Token Management
  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    
    // Set up automatic token refresh
    const expiresAt = Date.now() + (tokens.expiresIn * 1000);
    const refreshTime = expiresAt - (5 * 60 * 1000); // Refresh 5 minutes before expiry
    
    setTimeout(() => {
      this.refreshToken().catch(() => {
        this.clearAuth();
      });
    }, refreshTime - Date.now());
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // User Data Management
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Auth State
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // OAuth Methods (for future implementation)
  async loginWithGoogle(): Promise<AuthResponse> {
    // Redirect to Google OAuth
    window.location.href = `${apiClient['baseURL']}/auth/google`;
    return new Promise(() => {}); // This will not resolve as page redirects
  }

  async loginWithGithub(): Promise<AuthResponse> {
    // Redirect to GitHub OAuth
    window.location.href = `${apiClient['baseURL']}/auth/github`;
    return new Promise(() => {}); // This will not resolve as page redirects
  }
}

export const authService = new AuthService();