import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto'; // Импортируем DTO
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('wishlist')
  @UseGuards(JwtAuthGuard)
  async getWishlist(@Request() req) {
    return this.userService.getWishlist(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser (@Param('id') id: number, @Request() req) {
    const user = await this.userService.getUserById(id);

    if (req.user.role === 'admin') {
        const { password, ...filteredUser  } = user;
        return filteredUser; // Возвращаем полную информацию для администратора
    }
  
    // Если не администратор, убираем личные данные
    const { email, password, orders, wishlist, ...filteredUser  } = user;
    return filteredUser ; // Возвращаем только необходимые данные
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async updateUser (@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.updateUser (id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser (@Param('id') id: number) {
    return this.userService.deleteUser (id);
  }

  @Post('wishlist/:productId')
  @UseGuards(JwtAuthGuard)
  async addToWishlist(@Param('productId') variantId: number, @Request() req) {
    return this.userService.addToWishlist(req.user, variantId);
  }

  @Delete('wishlist/:productId')
  @UseGuards(JwtAuthGuard)
  async removeFromWishlist(@Param('productId') variantId: number, @Request() req) {
    return this.userService.removeFromWishlist(req.user, variantId);
  }
}