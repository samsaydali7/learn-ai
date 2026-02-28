import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h1>Blog CMS</h1>
        <p class="subtitle">Administrator Login</p>
        
        <div *ngIf="error" class="error-message">{{ error }}</div>
        
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Username</label>
            <input 
              type="text" 
              [(ngModel)]="username" 
              name="username"
              placeholder="admin"
            />
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="admin"
            />
          </div>
          
          <button type="submit" [disabled]="isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        
        <p class="hint">Demo credentials - Username: admin, Password: admin</p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .login-box {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }
    
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 10px;
    }
    
    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      color: #333;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }
    
    button {
      width: 100%;
      padding: 10px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    button:hover:not(:disabled) {
      background: #5568d3;
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
      border: 1px solid #f5c6cb;
    }
    
    .hint {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 20px;
    }
  `]
})
export class LoginComponent {
  username = 'admin';
  password = 'admin';
  isLoading = false;
  error = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    this.error = '';
    this.isLoading = true;

    try {
      const response = await this.apiService.login(this.username, this.password);
      
      if (response.success) {
        const { access_token, user } = response.data;
        this.authService.login(access_token, user);
        this.router.navigate(['/dashboard']);
      } else {
        this.error = response.message || 'Login failed';
      }
    } catch (err: unknown) {
      this.error = 'An error occurred. Make sure the backend is running!';
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }
}
