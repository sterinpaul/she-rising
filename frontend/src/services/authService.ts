import api from '../utils/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signIn', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async logout(): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signOut');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      // Try to access a protected route to check if user is authenticated
      const response = await api.get('/auth/status');
      return response.data.status === true;
    } catch (error) {
      return false;
    }
  }

  // Helper method to check if user is currently authenticated
  isAuthenticated(): boolean {
    // Since we're using httpOnly cookies, we can't check the token on client side
    // This will be determined by API responses
    return true; // Actual auth state will be managed by API responses
  }
}

export const authService = new AuthService();