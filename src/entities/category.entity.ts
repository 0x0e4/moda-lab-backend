import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { CategoryAttribute } from './categoryAttribute.entity';

export enum Gender {
  UNISEX = 'unisex',
  MALE = 'male',
  FEMALE = 'female'
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, category => category.subcategories, { nullable: true, onDelete: 'SET NULL' })
  parentCategory: Category;

  @OneToMany(() => Category, category => category.parentCategory)
  subcategories: Category[];

  @Column({ type: 'enum', enum: Gender, default: Gender.UNISEX })
  gender: Gender;

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @OneToMany(() => CategoryAttribute, ca => ca.category)
  categoryAttributes: CategoryAttribute[];
}