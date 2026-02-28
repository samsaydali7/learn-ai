export interface Post {
  id: string;
  title: string;
  content: string;
  mainImage: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface ApiResult<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
