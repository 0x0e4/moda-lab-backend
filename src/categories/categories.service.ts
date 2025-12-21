import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, In, IsNull, Not, Or, Repository, TreeRepository } from 'typeorm';
import { Category, Gender } from '../entities/category.entity';
import { Attribute } from 'src/entities/attribute.entity';
import { CategoryAttribute } from 'src/entities/categoryAttribute.entity';
import { ProductAttributeValue } from 'src/entities/productAttributeValue.entity';

interface CategoryTree extends Category {
  subcategories: CategoryTree[];
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: TreeRepository<Category>,
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
    @InjectRepository(CategoryAttribute)
    private categoryAttributeRepository: Repository<CategoryAttribute>,
    @InjectRepository(ProductAttributeValue)
    private productAttributeValueRepository: Repository<ProductAttributeValue>,
  ) { }

  async createCategory(name: string, parentId?: number): Promise<Category> {
    const category = this.categoriesRepository.create({ name: name, parentCategory: parentId ? { id: parentId } : undefined });
    return this.categoriesRepository.save(category);
  }

  async deleteCategory(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id: id });
    if (category == null) throw new NotFoundException(`Category not found`);
    return this.categoriesRepository.remove(category);
  }

  async getCategoryAttribs(categoryId: number): Promise<any[]> {
    // 1. Получаем категорию с подкатегориями
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
      relations: ['subcategories'],
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    // Собираем id всех категорий и подкатегорий
    const categoryIds: number[] = [];
    const collectIds = (cat: Category) => {
      categoryIds.push(cat.id);
      if (cat.subcategories?.length) {
        cat.subcategories.forEach(sub => collectIds(sub));
      }
    };
    collectIds(category);

    // 2. Получаем все атрибуты, привязанные к этим категориям
    const catAttribs = await this.categoryAttributeRepository.find({
      where: { category: In(categoryIds) },
      relations: ['attribute', 'category'],
    });

    if (!catAttribs.length) return [];

    const attribIds = catAttribs.map(ca => ca.attribute.id);

    // 3. Получаем все значения атрибутов, которые реально используются у товаров в этих категориях
    const productAttribValues = await this.productAttributeValueRepository
      .createQueryBuilder('pav')
      .leftJoin('pav.value', 'av')
      .leftJoin('av.attribute', 'a')
      .leftJoin('pav.variant', 'pv')
      .leftJoin('pv.product', 'p')
      .where('p.categoryId IN (:...categoryIds)', { categoryIds })
      .andWhere('a.id IN (:...attribIds)', { attribIds })
      .select([
        'a.id AS attributeId',
        'a.name AS attributeName',
        'av.value AS value',
        'p.categoryId AS categoryId',
      ])
      .getRawMany();

    // 4. Группируем значения по атрибуту
    const valuesMap: Record<number, Set<string>> = {};
    const namesMap: Record<number, string> = {};
    for (const row of productAttribValues) {
      const attrId = Number.parseInt(row.attributeId);
      if (!valuesMap[attrId]) valuesMap[attrId] = new Set();
      valuesMap[attrId].add(row.value);
      namesMap[attrId] = row.attributeName;
    }

    // 5. Формируем итоговую структуру
    const result: any[] = [];
    for(const key in valuesMap)
    {
      result.push({
        attributeId: key,
        attributeName: namesMap[key],
        values: Array.from(valuesMap[key] ?? [])
      });
    }

    return result;
  }

  async getCategories(gender: Gender): Promise<Category[]> {
    const categories = await this.categoriesRepository.find({ where: [{ gender: Gender.UNISEX }, { gender: gender }], relations: ['parentCategory'] });
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

  async createCategoryAttribute(category: Category, attributeName: string, isFilterable = true) {
    // 1. Найти существующий атрибут
    let attribute = await this.attributeRepository.findOne({ where: { name: attributeName } });

    // 2. Если атрибут не найден — создаём
    if (!attribute) {
      attribute = this.attributeRepository.create({ name: attributeName });
      attribute = await this.attributeRepository.save(attribute);
    }

    // 3. Создаём связь category_attribute
    const catAttr = this.categoryAttributeRepository.create({
      category,
      attribute,
      isFilterable,
    });

    return this.categoryAttributeRepository.save(catAttr);
  }

  // Удаляет атрибут категории по имени атрибута
  async deleteCatAttrib(category: Category, attribName: string): Promise<void> {
    const catAttrib = await this.categoryAttributeRepository.findOne({
      where: {
        category: { id: category.id },
        attribute: { name: attribName },
      },
      relations: ['attribute', 'category'],
    });

    if (catAttrib) {
      await this.categoryAttributeRepository.remove(catAttrib);
    }
  }

  // Проверяет, существует ли атрибут категории по имени атрибута
  async isCategoryAttribExists(category: Category, attribName: string): Promise<boolean> {
    const count = await this.categoryAttributeRepository.count({
      where: {
        category: { id: category.id },
        attribute: { name: attribName },
      },
      relations: ['attribute', 'category'],
    });

    return count > 0;
  }
}