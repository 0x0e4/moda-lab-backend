import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];

  @ManyToMany(() => User, user => user.wishlist) // Связь с пользователем
  users: User[]; // Список желаемого

  @Column('json', { nullable: true }) // Динамичные атрибуты
  attributes: Record<string, any>;

  @Column('integer', { default: 0 })
  count: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}