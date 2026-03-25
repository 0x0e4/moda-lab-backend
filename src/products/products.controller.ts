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
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(
      createProductDto
    );
  }

  @Get('attributes')
  async getAttributes(): Promise<Attribute[]> {
    return this.productsService.getAttributes();
  }

  @CacheTTL(60000)
  @Get('search')
  async getProductsBySearchQuery(
    @Query('categoryId') categoryId: number | undefined,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 30,
    @Query('sortBy') sortBy: string = 'id',
    @Query('order') order: string = 'ASC',
    @Query('filter', ParseJsonPipe) filter: { attributeId: number; valueId: number }[] = [],
    @Query('query') searchQuery: string
  ): Promise<object> {
    if (limit > 50 || limit < 5) throw new BadRequestException('Limit must be in 5 to 50.');
    if (page < 1) throw new BadRequestException('Page must be greater than 0.');
    if(!searchQuery || searchQuery.length == 0 || searchQuery.trim().length == 0) throw new BadRequestException('Type something in query.');
    order = order.toUpperCase();
    if(order != 'ASC' && order != 'DESC') throw new BadRequestException('Invalid order of sort.');

    return this.productsService.search(categoryId, page, limit, sortBy, order, filter, searchQuery);
  }

  @CacheTTL(60000)
  @Get('category/:categoryId')
  async getProductsByCategory(
    @Param('categoryId') categoryId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 30,
    @Query('sortBy') sortBy: string = 'id',
    @Query('order') order: string = 'ASC',
    @Query('filter', ParseJsonPipe) filter: { attributeId: number; valueId: number }[] = [],
  ): Promise<object> {
    if (limit > 50 || limit < 5) throw new BadRequestException('Limit must be in 5 to 50.');
    if (page < 1) throw new BadRequestException('Page must be greater than 0.');
    order = order.toUpperCase();
    if(order != 'ASC' && order != 'DESC') throw new BadRequestException('Invalid order of sort.');

    return this.productsService.getProductsByCategory(categoryId, page, limit, sortBy, order, filter);
  }

  @Get(':variantId')
  async getProductInfo(@Param('variantId') variantId: number): Promise<Product | null> {
    return this.productsService.getProductInfo(variantId);
  }
}