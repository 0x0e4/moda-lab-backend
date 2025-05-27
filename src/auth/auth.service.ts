import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService, // Внедрение UsersService
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser  = await this.usersService.findByEmail(registerDto.email);
    if (existingUser ) {
      throw new Error('User  already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return user; // Возвращаем созданного пользователя
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser (loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: '8h$iRGka#120GDtq' }),
    };
  }

  private async validateUser (email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new Error('Invalid credentials');
  }
}