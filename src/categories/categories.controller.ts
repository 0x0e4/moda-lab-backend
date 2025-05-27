import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '../entities/category.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createCategory(@Body() createCategoryDto: { name: string; parentId?: number }): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto.name, createCategoryDto.parentId);
  }

  @Get()
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }
}