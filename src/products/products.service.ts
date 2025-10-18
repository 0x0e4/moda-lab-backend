import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { ProductAttrib } from 'src/entities/prodattrib.entity';
import { CategoryAttrib } from 'src/entities/catattrib.entity';
import { Attrib } from './products.controller';

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
    public prodAttribRepository: Repository<ProductAttrib>,
    @InjectRepository(ProductAttrib)
    public catAttribRepository: Repository<CategoryAttrib>,
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

  async addProductAttrib(productId: number, attribName: string, attribValue: string): Promise<ProductAttrib> {
    const product = await this.productsRepository.findOneBy({ id: productId });
    if(product == null) throw new NotFoundException(`Product with ID ${productId} not found`);
    const attrib = this.prodAttribRepository.create({ prod: product, attribName: attribName, attribValue: attribValue });
    return this.prodAttribRepository.save(attrib);
  }

  async removeProductAttrib(productId: number, attribName: string): Promise<ProductAttrib> {
    const productAttrib = await this.prodAttribRepository.findOneBy({ prodId: productId, attribName: attribName });
    if(productAttrib == null) throw new NotFoundException(`Product attribute not found`);
    return this.prodAttribRepository.remove(productAttrib);
  }

  async getProductInfo(prodId: number): Promise<{ product: Product | null, attribs: Attrib[] }> {
    const product = await this.productsRepository.findOneBy({ id: prodId });
    const attribs = await this.prodAttribRepository.find({ where: { prodId: prodId }, select: [ "attribName", "attribValue" ]});
  
    return {
      product,
      attribs,
    };
  }

  async getRandomProducts(limit: number, page: number, seed: number): Promise<{ products: Product[], hasMore: boolean }> {
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
  }

  async isProductsExistByAttrib(category: Category, attribName: string): Promise<boolean> {
    return await this.prodAttribRepository.count({ where: { category: category, attribName: attribName } }) > 0;
  }

  async getProductsByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 30,
    sortBy: string = 'name',
    filter: Attrib[] = []
  ): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product')
      .where('product.categoryId = :categoryId', { categoryId })
      .skip((page - 1) * limit)
      .take(limit);

      filter.forEach(attrib => {
        query.andWhere('product.id IN (SELECT prodId FROM product_attrib WHERE attribName = :filterName AND attribValue = :filterValue)', { filterName: attrib.attribName, filterValue: attrib.attribValue });
      });

    if (sortBy) {
      query.orderBy(`product.${sortBy}`, 'ASC');
    }

    return await query.getMany();
  }
}