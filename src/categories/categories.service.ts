import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async createCategory(name: string, parentId?: number): Promise<Category> {
    const category = this.categoriesRepository.create({ name: name, parentCategory: parentId ? { id: parentId } : undefined });
    return this.categoriesRepository.save(category);
  }

  async getCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({ relations: ['subcategories'] });
  }
}