import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { ProductVariant } from 'src/entities/productVariant.entity';
import { ProductImage } from 'src/entities/productImage.entity';
import { ProductAttributeValue } from 'src/entities/productAttributeValue.entity';
import { Attribute } from 'src/entities/attribute.entity';
import { AttributeValue } from 'src/entities/attributeValue.entity';
import { ProductSize } from 'src/entities/productSize.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({
        ttl: 10000, // секунды
        max: 100, // максимальное количество записей
      }),TypeOrmModule.forFeature([Product, Category, ProductVariant, ProductSize, ProductImage, ProductAttributeValue, Attribute, AttributeValue])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}