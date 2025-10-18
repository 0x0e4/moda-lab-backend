import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Index, PrimaryColumn, BeforeInsert, AfterRemove, getRepository, Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductsService } from 'src/products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryAttrib } from './catattrib.entity';

@Entity()
export class ProductAttrib {
  @ManyToOne(() => Product, prod => prod.attributes)
  prod: Product;

  @ManyToOne(() => Category, cat => cat.prodAttr)
  category: Category;

  @Column({ nullable: true })
  @PrimaryColumn()
  prodId: number;

  @Column()
  @PrimaryColumn()
  attribName: string;

  @Column()
  attribValue: string;
}