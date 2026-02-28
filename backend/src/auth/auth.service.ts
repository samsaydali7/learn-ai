import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface User {
  id: string;
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: Map<string, User> = new Map();
  private defaultAdmin = {
    id: '1',
    username: 'admin',
    password: 'admin',
  };

  constructor(private jwtService: JwtService) {
    this.users.set('admin', this.defaultAdmin);
  }

  async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = this.users.get(username);
    if (user && user.password === password) {
      const { password: _p, ...result } = user;
      return result as Omit<User, 'password'>;
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
