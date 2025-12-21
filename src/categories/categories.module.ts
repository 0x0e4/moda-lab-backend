import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from '../entities/category.entity';
import { Attribute } from 'src/entities/attribute.entity';
import { CategoryAttribute } from 'src/entities/categoryAttribute.entity';
import { ProductAttributeValue } from 'src/entities/productAttributeValue.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({
        ttl: 10000, // секунды
        max: 100, // максимальное количество записей
      }),TypeOrmModule.forFeature([Category, Attribute, CategoryAttribute, ProductAttributeValue])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}