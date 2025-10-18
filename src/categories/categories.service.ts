import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, TreeRepository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryAttrib } from 'src/entities/catattrib.entity';

interface CategoryTree extends Category {
  subcategories: CategoryTree[];
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: TreeRepository<Category>,
    @InjectRepository(CategoryAttrib)
    private catAttribsRepository: Repository<CategoryAttrib>,
  ) { }

  async createCategory(name: string, parentId?: number): Promise<Category> {
    const category = this.categoriesRepository.create({ name: name, parentCategory: parentId ? { id: parentId } : undefined });
    return this.categoriesRepository.save(category);
  }

  async getCategories(): Promise<Category[]> {
    const categories = await this.categoriesRepository.find({ relations: ['parentCategory'] });
    const map = new Map<number, CategoryTree>();
    const roots: CategoryTree[] = [];

    // Инициализируем карту
    categories.forEach((cat) => {
      map.set(cat.id, { ...cat, subcategories: [] });
    });

    // Строим дерево
    map.forEach((cat) => {
      if (cat.parentCategory === null) {
        roots.push(cat); // Корневая категория
      } else {
        const parent = map.get(cat.parentCategory.id);
        if (parent) {
          parent.subcategories.push(cat);
        }
      }
    });

    return roots;
  }

  async createCatAttrib(category: Category, attribName: string): Promise<CategoryAttrib> {
    const catAttrib = this.catAttribsRepository.create({ category: category, attribName: attribName });
    return this.catAttribsRepository.save(catAttrib);
  }

  async deleteCatAttrib(category: Category, attribName: string): Promise<void> {
    const catAttrib = await this.catAttribsRepository.findOneBy({ category: category, attribName: attribName });
    if (catAttrib !== null)
      this.catAttribsRepository.remove(catAttrib);
  }

  async isCategoryAttribExists(category: Category, attribName: string): Promise<boolean> {
    return (await this.catAttribsRepository.findBy({ category: category, attribName: attribName })).length > 0;
  }
}