import { Controller, Post, Body, Get, UseGuards, Query, Param, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async createProduct(
    @Body() createProductDto: { name: string; price: number; desc: string; imageUrl: string; attributes: Record<string, any>; categoryId: number }
  ): Promise<Product> {
    return this.productsService.createProduct(createProductDto.name, createProductDto.price, createProductDto.desc, createProductDto.imageUrl, createProductDto.attributes, createProductDto.categoryId);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async addProduct(
    @Body() addProductDto: { productId: number; count: number; }
  ): Promise<Product> {
    return this.productsService.addProduct(addProductDto.productId, addProductDto.count);
  }

  @Get('random')
  async getRandomProducts(
    @Query('limit') limit: number = 30,
    @Query('offset') offset: number = 0,
    @Query('seed') seed: number
  ): Promise<{ products: Product[], hasMore: boolean }> {
    return this.productsService.getRandomProducts(limit, offset, seed);
  }

  @Get('category/:categoryId')
  async getProductsByCategory(
    @Param('categoryId') categoryId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 30,
    @Query('sortBy') sortBy: string = 'name',
    @Query('filter') filter: string = ''
  ): Promise<Product[]> {
    if (limit > 50) limit = 50;
    return this.productsService.getProductsByCategory(categoryId, page, limit, sortBy, filter);
  }
}