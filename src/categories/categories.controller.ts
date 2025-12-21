import { Controller, Post, Body, Get, Param, UseGuards, Delete, Query, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category, Gender } from '../entities/category.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCategoryDto } from 'src/dto/category.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('categories')
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto.name, createCategoryDto.parentId);
  }

  @Delete(':categoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCategory(@Param('categoryId') id: number): Promise<Category> {
    return this.categoriesService.deleteCategory(id);
  }

  @Get('attributes/:categoryId')
  async getCategoryAttributes(@Param('categoryId') id: number): Promise<any[]> {
    return this.categoriesService.getCategoryAttribs(id);
  }

  @Get()
  async getCategories(@Query('gender') gender: Gender): Promise<Category[]> {
    return this.categoriesService.getCategories(gender);
  }
}