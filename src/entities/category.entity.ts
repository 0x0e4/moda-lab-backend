import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Tree, TreeParent, TreeChildren } from 'typeorm';
import { Product } from './product.entity';
import { CategoryAttrib } from './catattrib.entity';
import { ProductAttrib } from './prodattrib.entity';

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

  @OneToMany(() => CategoryAttrib, attr => attr.category)
  attributes: CategoryAttrib[];

  @OneToMany(() => ProductAttrib, attr => attr.category)
  prodAttr: ProductAttrib[];
}