import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ProductSize } from './productSize.entity';
import { ProductVariant } from './productVariant.entity';
import { User } from './user.entity';

@Entity()
export class ProductCart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => ProductVariant)
  productVariant: ProductVariant;

  @ManyToOne(() => ProductSize)
  size?: ProductSize;

  @Column()
  quantity: number;
}