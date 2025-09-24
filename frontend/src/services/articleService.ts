import api from '../utils/api';
import type { Article } from '../types/dashboard';

export interface ArticleResponse {
  status: boolean;
  data?: Article | Article[];
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ArticleFilters {
  page?: number;
  limit?: number;
  category?: string;
  author?: string;
  search?: string;
}

class ArticleService {
  private readonly adminBasePath = '/admin';
  private readonly publicBasePath = '/articles';

  // Admin methods (protected routes)
  async getAllArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
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
      throw new Error(error.response?.data?.message || 'Failed to fetch articles');
    }
  }

  async getArticleById(id: string): Promise<ArticleResponse> {
    try {
      const response = await api.get(`${this.adminBasePath}/article/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch article');
    }
  }

  async createArticle(articleData: Omit<Article, 'id' | 'createdAt'>, images?: File[]): Promise<ArticleResponse> {
    try {
      const formData = new FormData();
      
      // Add text data
      Object.entries(articleData).forEach(([key, value]) => {
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
      if (articleData.images && articleData.images.length > 0) {
        articleData.images.forEach((imageUrl) => {
          formData.append('existingImages', imageUrl);
        });
      }
      
      const response = await api.post(`${this.adminBasePath}/add-article`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create article');
    }
  }

  async updateArticle(id: string, articleData: Partial<Article>, images?: File[]): Promise<ArticleResponse> {
    try {
      const formData = new FormData();
      
      // Add text data
      Object.entries(articleData).forEach(([key, value]) => {
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
      if (articleData.images && articleData.images.length > 0) {
        articleData.images.forEach((imageUrl) => {
          formData.append('existingImages', imageUrl);
        });
      }
      
      const response = await api.put(`${this.adminBasePath}/edit-article/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update article');
    }
  }

  async deleteArticle(id: string): Promise<ArticleResponse> {
    try {
      const response = await api.delete(`${this.adminBasePath}/delete-article/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete article');
    }
  }

  // Public methods (no auth required)
  async getPublicArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
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
      throw new Error(error.response?.data?.message || 'Failed to fetch articles');
    }
  }

  async getPublicArticleById(id: string): Promise<ArticleResponse> {
    try {
      const response = await api.get(`${this.publicBasePath}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch article');
    }
  }
}

export const articleService = new ArticleService();