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

  @InjectRepository(CategoryAttrib)
  private catattribRepository: Repository<CategoryAttrib>;
  @InjectRepository(ProductAttrib)
  private prodAttribRepository: Repository<ProductAttrib>;

  @BeforeInsert()
  async addCategoryAttrib() {
    this.category = this.prod.category;

    if((await this.catattribRepository.findBy({ category: this.category, attribName: this.attribName })).length == 0)
    {
      const catAttrib = this.catattribRepository.create({ category: this.category, attribName: this.attribName });
      return this.catattribRepository.save(catAttrib);
    }
  }

  @AfterRemove()
  async deleteCategoryAttrib() {
    if(await this.prodAttribRepository.count({ where: { category: this.category, attribName: this.attribName } }) == 0)
    {
      const catAttrib = await this.catattribRepository.findOneBy({ category: this.category, attribName: this.attribName });
      if(catAttrib !== null)
        this.catattribRepository.remove(catAttrib);
    }
  }
}