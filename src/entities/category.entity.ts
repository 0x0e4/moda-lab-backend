import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories, { nullable: true })
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  subcategories: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}