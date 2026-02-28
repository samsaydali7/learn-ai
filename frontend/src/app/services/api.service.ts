import { Injectable } from '@angular/core';
import { Post, Category, ApiResult, AuthResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor() {}

  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  login(username: string, password: string) {
    return fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json() as Promise<ApiResult<AuthResponse>>);
  }

  // Posts API
  getAllPosts() {
    return fetch(`${this.apiUrl}/posts`, {
      headers: this.getHeaders(),
    }).then(res => res.json() as Promise<ApiResult<Post[]>>);
  }

  getPost(id: string) {
    return fetch(`${this.apiUrl}/posts/${id}`, {
      headers: this.getHeaders(),
    }).then(res => res.json() as Promise<ApiResult<Post>>);
  }

  createPost(post: Partial<Post>) {
    return fetch(`${this.apiUrl}/posts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(post),
    }).then(res => res.json() as Promise<ApiResult<Post>>);
  }

  updatePost(id: string, post: Partial<Post>) {
    return fetch(`${this.apiUrl}/posts/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(post),
    }).then(res => res.json() as Promise<ApiResult<Post>>);
  }

  deletePost(id: string) {
    return fetch(`${this.apiUrl}/posts/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    }).then(res => res.json() as Promise<ApiResult>);
  }

  // Categories API
  getCategories() {
    return fetch(`${this.apiUrl}/categories`, {
      headers: this.getHeaders(),
    }).then(res => res.json() as Promise<ApiResult<Category[]>>);
  }

  getCategory(id: string) {
    return fetch(`${this.apiUrl}/categories/${id}`, {
      headers: this.getHeaders(),
    }).then(res => res.json() as Promise<ApiResult<Category>>);
  }

  createCategory(category: Partial<Category>) {
    return fetch(`${this.apiUrl}/categories`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(category),
    }).then(res => res.json() as Promise<ApiResult<Category>>);
  }

  updateCategory(id: string, category: Partial<Category>) {
    return fetch(`${this.apiUrl}/categories/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(category),
    }).then(res => res.json() as Promise<ApiResult<Category>>);
  }

  deleteCategory(id: string) {
    return fetch(`${this.apiUrl}/categories/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    }).then(res => res.json() as Promise<ApiResult>);
  }
}
