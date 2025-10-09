import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { Category } from './category.entity';
import { ProductAttrib } from './prodattrib.entity';

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

  @Column('json', { nullable: true })
  imageUrls: string[];

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];

  @OneToMany(() => ProductAttrib, (attr) => attr.prod)
  attributes: ProductAttrib[];

  @ManyToMany(() => User, user => user.wishlist)
  users: User[];

  @Column('integer', { default: 0 })
  count: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}