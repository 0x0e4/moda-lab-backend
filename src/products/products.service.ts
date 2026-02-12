import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category, Gender } from '../entities/category.entity';
import { ProductVariant } from 'src/entities/productVariant.entity';
import { AttributeValue } from 'src/entities/attributeValue.entity';
import { ProductAttributeValue } from 'src/entities/productAttributeValue.entity';
import { ProductImage } from 'src/entities/productImage.entity';
import { CreateProductDto } from 'src/dto/product.dto';
import { Attribute } from 'src/entities/attribute.entity';
import { ProductSize } from 'src/entities/productSize.entity';
import { ProductSizeItem } from 'src/entities/productSizeItem.entity';

interface Dictionary<T> {
  [key: string]: T
}

export interface SearchProduct {
  product_id: number;
  product_name: string;
  product_categoryId: number;
  variant_id: number;
  variant_sku: string;
  variant_price: string;
  variant_images: string[];
}

export interface AppliedFilter {
  attributeId: number;
  valueId: number;
}

export interface SearchResponse {
  query: string;                      // исходный запрос пользователя
  products: SearchProduct[];          // найденные товары
  total: number;                      // общее количество найденных товаров
  categoryId: number;                 // ID категории, в которой искал бэкенд
  appliedFilters?: AppliedFilter[];   // фильтры, которые применил бэкенд
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(ProductVariant)
    public productVariantsRepository: Repository<ProductVariant>,
    @InjectRepository(AttributeValue)
    public attributeValuesRepository: Repository<AttributeValue>,
    @InjectRepository(ProductAttributeValue)
    public productAttributeValuesRepository: Repository<ProductAttributeValue>,
    @InjectRepository(ProductImage)
    public productImagesRepository: Repository<ProductImage>,
    @InjectRepository(Attribute)
    public attributeRepository: Repository<Attribute>,
    @InjectRepository(ProductSize)
    public productSizeRepository: Repository<ProductSize>,
    @InjectRepository(ProductSizeItem)
    public productSizeItemRepository: Repository<ProductSizeItem>,
  ) { }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoriesRepository.findOneBy({ id: dto.categoryId });
    if (!category) throw new NotFoundException(`Category with id ${dto.categoryId} not found`);

    const product = this.productsRepository.create({
      name: dto.name,
      category: category,
    });
    await this.productsRepository.save(product);

    // Создаём все варианты
    for (const variantDto of dto.variants) {
      const variant = this.productVariantsRepository.create({
        product: product,
        price: variantDto.price,
        sku: variantDto.sku,
        sizes: variantDto.sizes.map(value => ({ id: value.size }))
      });
      await this.productVariantsRepository.save(variant);

      // Привязываем атрибуты к варианту
      for (const attr of variantDto.attributes) {
        const value = await this.attributeValuesRepository.findOneBy({ id: attr.valueId });
        if (!value) throw new NotFoundException(`Attribute value with id ${attr.valueId} not found`);

        const pav = this.productAttributeValuesRepository.create({
          variant,
          value,
        });
        await this.productAttributeValuesRepository.save(pav);
      }

      // Привязываем картинки к варианту, если есть
      if (variantDto.imageUrls?.length) {
        for (let i = 0; i < variantDto.imageUrls.length; i++) {
          const img = this.productImagesRepository.create({
            variant,
            url: variantDto.imageUrls[i],
            sortOrder: i,
          });
          await this.productImagesRepository.save(img);
        }
      }
    }

    return product;
  }

  async getAttributes(): Promise<Attribute[]> {
    const attributes = await this.attributeRepository.find({ relations: { values: true } });
    const sizes = await this.productSizeItemRepository.find();

    attributes.push({ id: 1, name: 'Размер', values: sizes.map(value => ({ id: value.id, value: value.size })) })

    return attributes;
  }

  // Получение информации о продукте с вариантами и атрибутами
  async getProductInfo(variantId: number): Promise<Product | null> {
    const variant = await this.productVariantsRepository.findOne({
      where: { id: variantId },
      relations: { product: true },
    });

    if (!variant) return null;

    const product = await this.productsRepository.findOne({
      where: { id: variant.product.id },
      relations: {
        category: true,
        variants: {
          attributeValues: { value: { attribute: true } },
          images: true,
          sizes: true
        },
      },
    });
    return product;
  }

  // Добавление товара на склад для конкретного варианта
  async addProductVariantCount(variantId: number, size: number, count: number): Promise<ProductVariant> {
    const variant = await this.productVariantsRepository.findOneBy({ id: variantId });
    if (!variant) throw new NotFoundException(`Variant with ID ${variantId} not found`);

    const sizes = variant.sizes;
    const sizeIndex = sizes.findIndex((value) => value.size.id == size);
    if (sizeIndex == -1) {
      const productSize = this.productSizeRepository.create({ productVariant: variant, size: { id: size }, stock: count });
      await this.productSizeRepository.save(productSize);
    } else {
      const productSize = sizes[sizeIndex];
      productSize.stock += count;
      await this.productSizeRepository.save(productSize);
    }
    return variant;
  }

  // Удаление атрибута из варианта
  async removeProductVariantAttribute(pavId: number): Promise<void> {
    const pav = await this.productAttributeValuesRepository.findOneBy({ id: pavId });
    if (!pav) throw new NotFoundException(`Product attribute value not found`);
    await this.productAttributeValuesRepository.remove(pav);
  }

  async search(searchString: string): Promise<any> {
    // TODO
  }

  /*async getRandomProducts(limit: number, page: number, seed: number): Promise<{ products: Product[], hasMore: boolean }> {
    const total = await this.productsRepository.count();
    const products = await this.productsRepository.createQueryBuilder('product')
      .orderBy(`RAND(${seed})`)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  
    return {
      products,
      hasMore: page * limit < total,
    };
  }*/

  // Проверяем, есть ли продукты в категории с указанным атрибутом
  async isProductsExistByAttrib(category: Category, attributeId: number): Promise<boolean> {
    const count = await this.productVariantsRepository
      .createQueryBuilder('variant')
      .innerJoin('variant.product', 'product')
      .innerJoin('variant.attributeValues', 'pav')
      .innerJoin('pav.value', 'av')
      .where('product.categoryId = :categoryId', { categoryId: category.id })
      .andWhere('av.attributeId = :attributeId', { attributeId })
      .getCount();

    return count > 0;
  }

  // Получаем продукты по категории с фильтрами по атрибутам
  async getProductsByCategory(
    categoryId: number,
    page = 1,
    limit = 30,
    sortBy = 'createdAt',
    order: ('ASC' | 'DESC') = 'DESC',
    filter: { attributeId: number; valueId: number }[] = [],
  ): Promise<object> {

    const allowedSort = ['name', 'price', 'createdAt'];
    if (!allowedSort.includes(sortBy)) {
      sortBy = 'name';
    }
    sortBy = (sortBy == 'price' ? 'v.' : 'p.') + sortBy;

    /**
     * ============================
     * 1. Рекурсивные категории
     * ============================
     */
    const categorySubQuery = `
    WITH RECURSIVE category_tree AS (
      SELECT id
      FROM category
      WHERE id = :categoryId
      UNION ALL
      SELECT c.id
      FROM category c
      INNER JOIN category_tree ct ON c.parentCategoryId = ct.id
    )
    SELECT id FROM category_tree
  `;

    const imagesSubQuery = `
    SELECT JSON_ARRAYAGG(
      pi.url
    )
    FROM product_image pi
    WHERE pi.variantId = v.id
  `;

    /**
     * ============================
     * 2. Основной QueryBuilder
     * ============================
     */
    const qb = this.productsRepository
      .createQueryBuilder('p')
      .leftJoin('product_variant', 'v', 'v.productId = p.id')
      .leftJoin('product_image', 'pi', 'pi.variantId = v.id')
      .leftJoin('product_size', 'ps', 'ps.productVariantId = v.id')

      .select([
        'p.id AS product_id',
        'p.name AS product_name',
        'p.categoryId AS product_categoryId',

        'v.id AS variant_id',
        'v.sku AS variant_sku',
        'v.price AS variant_price'
      ])

      .addSelect(`(${imagesSubQuery})`, 'variant_images')

      .where(`p.categoryId IN (${categorySubQuery})`)
      .setParameter('categoryId', categoryId)

      .groupBy('p.id, v.id')
      .orderBy(`${sortBy}`, order)
      .limit(limit)
      .offset((page - 1) * limit);

    /**
     * ============================
     * 3. Фильтры по атрибутам
     * ============================
     */
    if (filter.length > 0) {
      const sizes: number[] = [];

      const grouped = filter.reduce((acc, f) => {
        if (f.attributeId == 1) {
          sizes.push(f.valueId);
          return acc;
        }
        if (!acc[f.attributeId]) acc[f.attributeId] = [];
        acc[f.attributeId].push(f.valueId);
        return acc;
      }, {} as Record<number, number[]>);

      let index = 0;
      for (const values of Object.values(grouped)) {
        qb.andWhere(
          `
        EXISTS (
          SELECT 1
          FROM product_attribute_value pav_f
          WHERE pav_f.variantId = v.id
            AND pav_f.valueId IN (:...values_${index})
        )
        `,
          { [`values_${index}`]: values },
        );
        index++;
      }

      if (sizes.length > 0)
        qb.andWhere(`ps.sizeId IN (:...sizes)`, { [`sizes`]: sizes })
    }

    const countQb = qb.clone();

    const totalResult = await countQb
      .select('COUNT(DISTINCT v.id)', 'cnt')
      .orderBy()
      .limit(undefined)
      .offset(undefined)
      .groupBy()
      .getRawOne();

    const total = Number(totalResult.cnt);

    return {
      items: await qb.getRawMany(),
      meta: {
        total: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}