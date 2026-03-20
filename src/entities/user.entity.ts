import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Order } from './order.entity'; // Импортируем сущность Order
import { UserAddress } from './userAddress.entity'; // Импортируем сущность Order
import { Product } from './product.entity'; // Импортируем сущность Product
import { ProductVariant } from './productVariant.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  EMPLOYEE = 'employee'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  city: string; // Город пользователя

  @Column({ nullable: true })
  country: string; // Страна пользователя

  @Column({ default: true })
  isActive: boolean; // Статус активности пользователя

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Дата создания аккаунта

  @OneToMany(() => Order, order => order.user) // Связь с сущностью Order
  orders: Order[]; // Список заказов пользователя

  @OneToMany(() => UserAddress, addr => addr.user)
  addresses: UserAddress[];

  @ManyToMany(() => ProductVariant)
  @JoinTable()
  wishlist: ProductVariant[]; // Список желаемых продуктов
}