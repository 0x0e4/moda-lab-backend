import { Controller, Post, Body, Get, UseGuards, Query, Param, Put, Delete, BadRequestException, UseInterceptors, ParseArrayPipe, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import { CreateProductDto, ParseJsonPipe } from 'src/dto/product.dto';
import { Gender } from 'src/entities/category.entity';
import { Attribute } from 'src/entities/attribute.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    // предполагаем, что createProductDto.attributes теперь содержит {attributeId, valueId}[]
    return this.productsService.createProduct(
      createProductDto
    );
  }

  @Get('attributes')
  async getAttributes(): Promise<Attribute[]> {
    return this.productsService.getAttributes();
  }

  @Get(':variantId')
  async getProductInfo(@Param('variantId') variantId: number): Promise<Product | null> {
    return this.productsService.getProductInfo(variantId);
  }

  @CacheTTL(60000)
  @Get('category/:categoryId')
  async getProductsByCategory(
    @Param('categoryId') categoryId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 30,
    @Query('sortBy') sortBy: string = 'id',
    @Query('filter', ParseJsonPipe) filter: { attributeId: number; valueId: number }[] = [],
  ): Promise<Product[]> {
    if (limit > 50 || limit < 5) throw new BadRequestException('Limit must be in 5 to 50.');
    if (page < 1) throw new BadRequestException('Page must be greater than 0.');

    return this.productsService.getProductsByCategory(categoryId, page, limit, sortBy, filter);
  }
}