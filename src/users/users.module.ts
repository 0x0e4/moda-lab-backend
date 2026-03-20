import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { Product } from '../entities/product.entity';
import { ProductVariant } from 'src/entities/productVariant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, ProductVariant ])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}