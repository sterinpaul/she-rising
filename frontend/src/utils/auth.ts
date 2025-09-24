import type { AuthState, User } from '../types/dashboard';
import api from './api';

// In-memory auth state (since we use httpOnly cookies, we can't access the token directly)
let currentAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null // This will always be null since we use httpOnly cookies
};

// Auth state change listeners
type AuthStateListener = (authState: AuthState) => void;
const authStateListeners: AuthStateListener[] = [];

// Track if we're currently checking auth to prevent multiple concurrent calls
let isCheckingAuth = false;

export const authUtils = {
  // Get current auth state from memory (cookies are handled by browser automatically)
  getAuthState(): AuthState {
    return currentAuthState;
  },

  // Set auth state in memory only and notify listeners
  setAuthState(authState: AuthState): void {
    currentAuthState = authState;
    // Notify all listeners of auth state change
    authStateListeners.forEach(listener => listener(authState));
  },

  // Subscribe to auth state changes
  onAuthStateChange(listener: AuthStateListener): () => void {
    authStateListeners.push(listener);
    // Return unsubscribe function
    return () => {
      const index = authStateListeners.indexOf(listener);
      if (index > -1) {
        authStateListeners.splice(index, 1);
      }
    };
  },

  // Login user with real API call
  async login(email: string, password: string): Promise<AuthState> {
    try {
      const response = await api.post('/auth/signIn', {
        email,
        password
      });

      if (response?.data?.status) {
        const authState: AuthState = {
          isAuthenticated: true,
          user: response.data.user,
          token: null // Token is stored in httpOnly cookie
        };

        this.setAuthState(authState);
        return authState;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },

  // Logout user with real API call
  async logout(): Promise<void> {
    try {
      await api.post('/auth/signOut');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local auth state regardless of API call result
      this.setAuthState({
        isAuthenticated: false,
        user: null,
        token: null
      });
    }
  },

  // Check authentication status with server
  async checkAuthStatus(): Promise<boolean> {
    // Prevent multiple concurrent auth checks
    if (isCheckingAuth) {
      return currentAuthState.isAuthenticated;
    }

    isCheckingAuth = true;
    
    try {
      const response = await api.get('/auth/status');
      
      if (response.data.status) {
        const authState: AuthState = {
          isAuthenticated: true,
          user: response.data.user,
          token: null // Token is in httpOnly cookie
        };
        
        this.setAuthState(authState);
        return true;
      } else {
        this.setAuthState({
          isAuthenticated: false,
          user: null,
          token: null
        });
        return false;
      }
    } catch (error: any) {
      // Handle different error types
      if (error.response?.status === 401) {
        // Unauthorized - clear auth state
        this.setAuthState({
          isAuthenticated: false,
          user: null,
          token: null
        });
      }
      return false;
    } finally {
      isCheckingAuth = false;
    }
  },

  // Initialize auth state on app startup
  async initializeAuth(): Promise<boolean> {
    try {
      return await this.checkAuthStatus();
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      return false;
    }
  },

  // Check if user is authenticated (from memory state)
  isAuthenticated(): boolean {
    return currentAuthState.isAuthenticated;
  },

  // Get current user (from memory state)
  getCurrentUser(): User | null {
    return currentAuthState.user;
  },

  // Get auth token (always returns null since we use httpOnly cookies)
  getToken(): string | null {
    return null; // Tokens are stored in httpOnly cookies, not accessible to JS
  }
};