import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import type { User } from '../users/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() user: User) {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body() credentials: { email: string; password: string }) {
    return this.authService.login(credentials);
  }

  @Get('all-users')
  getAll() {
    return this.usersService.findAll();
  }
}