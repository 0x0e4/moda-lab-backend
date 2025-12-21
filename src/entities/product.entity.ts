import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { ProductVariant } from './productVariant.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @OneToMany(() => ProductVariant, variant => variant.product)
  variants: ProductVariant[];
}