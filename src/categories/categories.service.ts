import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryAttrib } from 'src/entities/catattrib.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(CategoryAttrib)
    private catAttribsRepository: Repository<CategoryAttrib>,
  ) {}

  async createCategory(name: string, parentId?: number): Promise<Category> {
    const category = this.categoriesRepository.create({ name: name, parentCategory: parentId ? { id: parentId } : undefined });
    return this.categoriesRepository.save(category);
  }

  async getCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({ relations: ['subcategories'] });
  }

  async createCatAttrib(category: Category, attribName: string): Promise<CategoryAttrib> {
    const catAttrib = this.catAttribsRepository.create({ category: category, attribName: attribName });
    return this.catAttribsRepository.save(catAttrib);
  }

  async deleteCatAttrib(category: Category, attribName: string): Promise<void> {
    const catAttrib = await this.catAttribsRepository.findOneBy({ category: category, attribName: attribName });
    if(catAttrib !== null)
      this.catAttribsRepository.remove(catAttrib);
  }

  async isCategoryAttribExists(category: Category, attribName: string): Promise<boolean> {
    return (await this.catAttribsRepository.findBy({ category: category, attribName: attribName })).length > 0;
  }
}