import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Post, Category } from '../../models';

interface Post {
  id: string;
  title: string;
  content: string;
  mainImage: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <nav class="navbar">
        <div class="navbar-content">
          <h1>Blog CMS Dashboard</h1>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </nav>

      <div class="container">
        <div class="tabs">
          <button 
            [class.active]="activeTab === 'posts'" 
            (click)="activeTab = 'posts'"
          >
            📝 Blog Posts
          </button>
          <button 
            [class.active]="activeTab === 'categories'" 
            (click)="activeTab = 'categories'"
          >
            🏷️ Categories
          </button>
        </div>

        <!-- Posts Tab -->
        <div *ngIf="activeTab === 'posts'" class="tab-content">
          <div class="section-header">
            <h2>Blog Posts</h2>
            <button (click)="togglePostForm()" class="btn-primary">
              + New Post
            </button>
          </div>

          <!-- Post Form -->
          <div *ngIf="showPostForm" class="form-section">
            <h3>{{ editingPostId ? 'Edit Post' : 'Create New Post' }}</h3>
            <form (ngSubmit)="savePost()">
              <div class="form-group">
                <label>Title</label>
                <input type="text" [(ngModel)]="postForm.title" name="title" required />
              </div>
              
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="postForm.categoryId" name="categoryId">
                  <option value="">No Category</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Main Image URL</label>
                <input 
                  type="text" 
                  [(ngModel)]="postForm.mainImage" 
                  name="mainImage"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div class="form-group">
                <label>Content</label>
                <textarea 
                  [(ngModel)]="postForm.content" 
                  name="content"
                  rows="6"
                  required
                ></textarea>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn-success">
                  {{ editingPostId ? 'Update Post' : 'Create Post' }}
                </button>
                <button type="button" (click)="togglePostForm()" class="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Posts List -->
          <div class="posts-list">
            <div *ngIf="posts.length === 0" class="empty-state">
              <p>No blog posts yet. Create one to get started!</p>
            </div>
            
            <div *ngFor="let post of posts" class="post-card">
              <div class="post-image">
                <img 
                  *ngIf="post.mainImage" 
                  [src]="post.mainImage" 
                  alt="{{ post.title }}"
                  (error)="onImageError($event)"
                />
                <div *ngIf="!post.mainImage" class="placeholder">No Image</div>
              </div>
              
              <div class="post-content">
                <h3>{{ post.title }}</h3>
                <p class="post-excerpt">{{ post.content.substring(0, 100) }}...</p>
                <div class="post-meta">
                  <span class="date">{{ post.createdAt | date: 'short' }}</span>
                  <span *ngIf="getCategoryName(post.categoryId)" class="category">
                    {{ getCategoryName(post.categoryId) }}
                  </span>
                </div>
                
                <div class="post-actions">
                  <button (click)="editPost(post)" class="btn-edit">Edit</button>
                  <button (click)="deletePost(post.id)" class="btn-delete">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Tab -->
        <div *ngIf="activeTab === 'categories'" class="tab-content">
          <div class="section-header">
            <h2>Categories</h2>
            <button (click)="toggleCategoryForm()" class="btn-primary">
              + New Category
            </button>
          </div>

          <!-- Category Form -->
          <div *ngIf="showCategoryForm" class="form-section">
            <h3>{{ editingCategoryId ? 'Edit Category' : 'Create New Category' }}</h3>
            <form (ngSubmit)="saveCategory()">
              <div class="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="categoryForm.name" 
                  name="name"
                  required
                />
              </div>
              
              <div class="form-group">
                <label>Description</label>
                <textarea 
                  [(ngModel)]="categoryForm.description" 
                  name="description"
                  rows="3"
                ></textarea>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn-success">
                  {{ editingCategoryId ? 'Update Category' : 'Create Category' }}
                </button>
                <button type="button" (click)="toggleCategoryForm()" class="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Categories List -->
          <div class="categories-list">
            <div *ngIf="categories.length === 0" class="empty-state">
              <p>No categories yet. Create one to organize posts!</p>
            </div>
            
            <div *ngFor="let category of categories" class="category-card">
              <div class="category-header">
                <h3>{{ category.name }}</h3>
                <span class="post-count">
                  {{ getPostsInCategory(category.id).length }} posts
                </span>
              </div>
              
              <p *ngIf="category.description" class="category-desc">
                {{ category.description }}
              </p>
              
              <div class="category-actions">
                <button (click)="editCategory(category)" class="btn-edit">Edit</button>
                <button (click)="deleteCategory(category.id)" class="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f5f5f5;
    }

    .navbar {
      background: #333;
      color: white;
      padding: 0;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar h1 {
      margin: 0;
      font-size: 24px;
    }

    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #ddd;
    }

    .tabs button {
      background: none;
      border: none;
      padding: 12px 20px;
      font-size: 16px;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
      color: #666;
    }

    .tabs button.active,
    .tabs button:hover {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h2 {
      margin: 0;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .form-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .form-section h3 {
      margin-top: 0;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-start;
    }

    .btn-success {
      background: #28a745;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-success:hover {
      background: #218838;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .posts-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .post-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .post-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }

    .post-image {
      width: 100%;
      height: 200px;
      background: #f0f0f0;
      overflow: hidden;
    }

    .post-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
      font-size: 14px;
    }

    .post-content {
      padding: 15px;
    }

    .post-content h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .post-excerpt {
      color: #666;
      font-size: 14px;
      margin-bottom: 10px;
      line-height: 1.5;
    }

    .post-meta {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      font-size: 12px;
      color: #999;
    }

    .category {
      background: #e3f2fd;
      color: #1976d2;
      padding: 2px 8px;
      border-radius: 3px;
    }

    .post-actions,
    .category-actions {
      display: flex;
      gap: 10px;
    }

    .btn-edit {
      background: #17a2b8;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.3s;
    }

    .btn-edit:hover {
      background: #138496;
    }

    .btn-delete {
      background: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.3s;
    }

    .btn-delete:hover {
      background: #c82333;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    .categories-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .category-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }

    .category-header h3 {
      margin: 0;
    }

    .post-count {
      background: #f0f0f0;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 12px;
      color: #666;
    }

    .category-desc {
      color: #666;
      font-size: 14px;
      margin-bottom: 15px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  activeTab: 'posts' | 'categories' = 'posts';
  posts: Post[] = [];
  categories: Category[] = [];

  showPostForm = false;
  showCategoryForm = false;

  postForm = { title: '', content: '', mainImage: '', categoryId: '' };
  categoryForm = { name: '', description: '' };

  editingPostId: string | null = null;
  editingCategoryId: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadPosts();
    this.loadCategories();
  }

  async loadPosts() {
    try {
      const response = await this.apiService.getAllPosts();
      if (response.success) {
        this.posts = response.data;
      }
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  }

  async loadCategories() {
    try {
      const response = await this.apiService.getCategories();
      if (response.success) {
        this.categories = response.data;
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }

  togglePostForm() {
    this.showPostForm = !this.showPostForm;
    if (!this.showPostForm) {
      this.resetPostForm();
    }
  }

  toggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
    if (!this.showCategoryForm) {
      this.resetCategoryForm();
    }
  }

  resetPostForm() {
    this.postForm = { title: '', content: '', mainImage: '', categoryId: '' };
    this.editingPostId = null;
  }

  resetCategoryForm() {
    this.categoryForm = { name: '', description: '' };
    this.editingCategoryId = null;
  }

  async savePost() {
    if (!this.postForm.title || !this.postForm.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (this.editingPostId) {
        const response = await this.apiService.updatePost(
          this.editingPostId,
          this.postForm
        );
        if (response.success) {
          alert('Post updated successfully!');
          this.loadPosts();
          this.togglePostForm();
        }
      } else {
        const response = await this.apiService.createPost(this.postForm);
        if (response.success) {
          alert('Post created successfully!');
          this.loadPosts();
          this.togglePostForm();
        }
      }
    } catch (err) {
      alert('Error saving post');
      console.error(err);
    }
  }

  async saveCategory() {
    if (!this.categoryForm.name) {
      alert('Please enter a category name');
      return;
    }

    try {
      if (this.editingCategoryId) {
        const response = await this.apiService.updateCategory(
          this.editingCategoryId,
          this.categoryForm
        );
        if (response.success) {
          alert('Category updated successfully!');
          this.loadCategories();
          this.toggleCategoryForm();
        }
      } else {
        const response = await this.apiService.createCategory(this.categoryForm);
        if (response.success) {
          alert('Category created successfully!');
          this.loadCategories();
          this.toggleCategoryForm();
        }
      }
    } catch (err) {
      alert('Error saving category');
      console.error(err);
    }
  }

  editPost(post: Post) {
    this.postForm = {
      title: post.title,
      content: post.content,
      mainImage: post.mainImage,
      categoryId: post.categoryId || '',
    };
    this.editingPostId = post.id;
    this.showPostForm = true;
  }

  editCategory(category: Category) {
    this.categoryForm = {
      name: category.name,
      description: category.description || '',
    };
    this.editingCategoryId = category.id;
    this.showCategoryForm = true;
  }

  async deletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await this.apiService.deletePost(id);
        if (response.success) {
          alert('Post deleted successfully!');
          this.loadPosts();
        }
      } catch (err) {
        alert('Error deleting post');
        console.error(err);
      }
    }
  }

  async deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await this.apiService.deleteCategory(id);
        if (response.success) {
          alert('Category deleted successfully!');
          this.loadCategories();
        }
      } catch (err) {
        alert('Error deleting category');
        console.error(err);
      }
    }
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return '';
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || '';
  }

  getPostsInCategory(categoryId: string): Post[] {
    return this.posts.filter(p => p.categoryId === categoryId);
  }

  onImageError(event: any) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
