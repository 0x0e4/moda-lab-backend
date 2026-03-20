import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { RolesGuard } from './roles.guard';
import { RefreshTokenStrategy } from './refreshJwt.strategy';
import { RefreshTokenGuard } from './resfreshJwt.guard';
import { ConfigService } from '@nestjs/config';
import { ProductVariant } from 'src/entities/productVariant.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
    TypeOrmModule.forFeature([User, Product, ProductVariant])
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, UserService, RolesGuard, RefreshTokenStrategy, RefreshTokenGuard, ConfigService],
  controllers: [AuthController],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
