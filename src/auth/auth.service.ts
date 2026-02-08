import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(user: any) {
    const exists = await this.usersService.findByEmail(user.email);
    if (exists) throw new ConflictException('El usuario ya existe');

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.usersService.create({ ...user, password: hashedPassword });

    const token = this.jwtService.sign({ sub: newUser.id, email: newUser.email });
    const { password, ...result } = newUser;
    return { ...result, token };
  }

  async login(credentials: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(credentials.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    const { password, ...result } = user;
    return { ...result, token };
  }
}
