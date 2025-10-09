import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { ProductAttrib } from 'src/entities/prodattrib.entity';

interface Dictionary<T> {
  [key: string]: T
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(ProductAttrib)
    private prodAttribRepository: Repository<ProductAttrib>,
  ) {}

  async createProduct(name: string, price: number, desc: string, imageUrl: string, attributes: Record<string, any>, categoryId: number): Promise<Product> {
    const category = await this.categoriesRepository.findOneBy({ id: categoryId });
    const product = this.productsRepository.create({ name: name, price: price, description: desc, imageUrls: [], category: category ? category : undefined });
    return this.productsRepository.save(product);
  }

  async addProduct(productId: number, count: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id: productId });
    if(product == null) throw new NotFoundException(`Product with ID ${productId} not found`);
    product.count += count > 0 ? count : 0;
    await this.productsRepository.update({ id: productId }, product);
    return product;
  }

  async getRandomProducts(limit: number, offset: number, seed: number): Promise<{ products: Product[], hasMore: boolean }> {
    const total = await this.productsRepository.count();
    const products = await this.productsRepository.createQueryBuilder('product')
      .orderBy(`RAND(${seed})`)
      .skip(offset)
      .take(limit)
      .getMany();
  
    return {
      products,
      hasMore: (offset + products.length) < total,
    };
  }

  async isProductsExistByAttrib(category: Category, attribName: string): Promise<boolean> {
    return await this.prodAttribRepository.count({ where: { category: category, attribName: attribName } }) > 0;
  }

  async getProductsByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 30,
    sortBy: string = 'name',
    filter: string = ''
  ): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product')
      .where('product.categoryId = :categoryId', { categoryId })
      .skip((page - 1) * limit)
      .take(limit);

    if (filter) {
      query.andWhere('product.name LIKE :filter', { filter: `%${filter}%` });
    }

    if (sortBy) {
      query.orderBy(`product.${sortBy}`, 'ASC');
    }

    return await query.getMany();
  }
}