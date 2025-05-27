import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '8h$iRGka#120GDtq',
    });
  }

  async validate(payload: any) {
    // Получаем пользователя по ID из payload
    const user = await this.usersService.getUserById(payload.sub);
    return user; // Возвращаем пользователя, который будет доступен в req.user
  }
}