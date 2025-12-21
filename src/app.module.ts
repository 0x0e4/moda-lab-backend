import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { User } from './entities/user.entity';
import { DeliveryPoint } from './entities/delpoint.entity';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { Category } from './entities/category.entity';
import { OrdersModule } from './orders/orders.module';
import { UserAddress } from './entities/userAddress.entity';
import { ProductAttributeValueSubscriber } from './products/prodattrib.subscriber';
import { Attribute } from './entities/attribute.entity';
import { AttributeValue } from './entities/attributeValue.entity';
import { CategoryAttribute } from './entities/categoryAttribute.entity';
import { OrderItem } from './entities/orderItem.entity';
import { ProductAttributeValue } from './entities/productAttributeValue.entity';
import { ProductImage } from './entities/productImage.entity';
import { ProductVariant } from './entities/productVariant.entity';
import { ProductSize } from './entities/productSize.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '',
      port: 3306,
      database: '',
      password: '',
      username: '',
      entities: [Product, Order, DeliveryPoint, User, Category, UserAddress, Attribute, ProductSize, AttributeValue, CategoryAttribute, OrderItem, ProductAttributeValue, ProductImage, ProductVariant],
      synchronize: true,
      autoLoadEntities: true,
      subscribers: [ProductAttributeValueSubscriber]
    }),
    UserModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    ProductsModule
  ],
})
export class AppModule { }