import api from '../utils/api';
import type { Impact } from '../types/dashboard';

export interface ImpactResponse {
  status: boolean;
  data?: Impact | Impact[];
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ImpactFilters {
  page?: number;
  limit?: number;
  search?: string;
}

class ImpactService {
  private readonly publicBasePath = '/impacts';

  // Admin methods (protected routes)
  async getAllImpacts(filters: ImpactFilters = {}): Promise<ImpactResponse> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`${this.publicBasePath}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch impacts');
    }
  }

  async getImpactById(id: string): Promise<ImpactResponse> {
    try {
      const response = await api.get(`${this.publicBasePath}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch impact');
    }
  }

  async createImpact(impactData: Omit<Impact, 'id' | 'createdAt'>, images?: File[]): Promise<ImpactResponse> {
    try {
      const formData = new FormData();
      
      // Add text data
      Object.entries(impactData).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined && value !== null) {
          formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
      });
      
      // Add image files
      if (images && images.length > 0) {
        images.forEach((file) => {
          formData.append('images', file);
        });
      }
      
      // Add existing images if any
      if (impactData.images && impactData.images.length > 0) {
        impactData.images.forEach((imageUrl) => {
          formData.append('existingImages', imageUrl);
        });
      }
      
      const response = await api.post(`${this.publicBasePath}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create impact');
    }
  }

  async updateImpact(id: string, impactData: Partial<Impact>, images?: File[]): Promise<ImpactResponse> {
    try {
      const formData = new FormData();
      
      // Add text data
      Object.entries(impactData).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined && value !== null) {
          formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
      });
      
      // Add new image files
      if (images && images.length > 0) {
        images.forEach((file) => {
          formData.append('images', file);
        });
      }
      
      // Add existing images
      if (impactData.images && impactData.images.length > 0) {
        impactData.images.forEach((imageUrl) => {
          formData.append('existingImages', imageUrl);
        });
      }
      
      const response = await api.put(`${this.publicBasePath}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update impact');
    }
  }

  async deleteImpact(id: string): Promise<ImpactResponse> {
    try {
      const response = await api.delete(`${this.publicBasePath}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete impact');
    }
  }

  // Public methods (no auth required)
  async getPublicImpacts(filters: ImpactFilters = {}): Promise<ImpactResponse> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`${this.publicBasePath}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch impacts');
    }
  }

  async getPublicImpactById(id: string): Promise<ImpactResponse> {
    try {
      const response = await api.get(`${this.publicBasePath}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch impact');
    }
  }
}

export const impactService = new ImpactService();