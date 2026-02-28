import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const result = await this.authService.login(user);
    return { success: true, data: result };
  }

  @Post('verify')
  async verify(@Body() verifyDto: { token: string }) {
    const payload = await this.authService.validateToken(verifyDto.token);
    if (!payload) {
      return { success: false, message: 'Invalid token' };
    }
    return { success: true, data: payload };
  }
}
