import { Controller, Post, Body, Get, UseGuards, Query, Param, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import { ProductAttrib } from 'src/entities/prodattrib.entity';

export interface Attrib {
  attribName: string;
  attribValue: string;
}

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

  @Get(':prodId')
  async getProductInfo(
    @Param('prodId') prodId: number
  ): Promise<{ product: Product | null, attribs: Attrib[] }> {
    return this.productsService.getProductInfo(prodId);
  }

  @Put('attributes')
  async addProductAttrib(
    @Body() addProductAttribDto: { productId: number; attribName: string; attribValue: string; }
  ): Promise<ProductAttrib> {
    return this.productsService.addProductAttrib(addProductAttribDto.productId, addProductAttribDto.attribName, addProductAttribDto.attribValue);
  }

  @Delete('attributes/:prodId/:attribName')
  async removeProductAttrib(
    @Param('prodId') productId: number, @Param('attribName') attribName: string
  ): Promise<ProductAttrib> {
    return this.productsService.removeProductAttrib(productId, attribName);
  }

  @Get('random')
  async getRandomProducts(
    @Query('limit') limit: number = 30,
    @Query('page') page: number = 1,
    @Query('seed') seed: number
  ): Promise<{ products: Product[], hasMore: boolean }> {
    return this.productsService.getRandomProducts(limit, page, seed);
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
    const attribs: Attrib[] = filter.length > 2 ? JSON.parse(filter) : [];

    return this.productsService.getProductsByCategory(categoryId, page, limit, sortBy, attribs);
  }
}