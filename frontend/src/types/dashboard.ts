export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface Article {
  id: string;
  _id?: string;
  title: string;
  createdAt: string;
  content: string;
  images: string[];
  author?: string;
  category?: string;
}

export interface Impact {
  id: string;
  _id?: string;
  title: string;
  createdAt: string;
  content: string;
  date: string;
  images: string[];
}

export interface DashboardStats {
  totalArticles: number;
  totalImpacts: number;
  recentViews: number;
}

export interface EditorState {
  isEditing: boolean;
  itemId?: string;
  type: 'article' | 'impact';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}