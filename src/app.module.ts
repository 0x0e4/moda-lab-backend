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
import { UserAddress } from './entities/address.entity';
import { CategoryAttrib } from './entities/catattrib.entity';
import { ProductAttrib } from './entities/prodattrib.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '',
      port: 3306,
      database: '',
      password: '',
      username: '',
      entities: [Product, Order, DeliveryPoint, User, Category, UserAddress, CategoryAttrib, ProductAttrib],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule
  ],
})
export class AppModule {}