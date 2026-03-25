import { Controller, Post, Body, Get, UseGuards, Param, Delete, UseInterceptors, Request, Patch, ConflictException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AddCartItemDto, UpdateCartItemDto } from 'src/dto/cart.dto';
import { ProductCart } from 'src/entities/productCart.entity';
import { CartService } from './cart.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCartItems(@Request() req): Promise<ProductCart[]> {
    return this.cartService.getCartItems(
        req.user
    )
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addCartItem(@Body() addCartItemDto: AddCartItemDto, @Request() req): Promise<ProductCart | null> {
    if(addCartItemDto.quantity < 1)
        throw new ConflictException(`Quantity less than 1`)

    return this.cartService.addCartItem(
        req.user,
        addCartItemDto
    );
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateCartItem(@Body() updateCartItemDto: UpdateCartItemDto, @Request() req): Promise<ProductCart> {
    if(updateCartItemDto.quantity < 1)
        throw new ConflictException(`Quantity less than 1`)

    return this.cartService.updateCartItem(
        req.user,
        updateCartItemDto
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeCartItem(@Param('id') cartItemId: number, @Request() req): Promise<ProductCart> {
    return this.cartService.removeCartItem(
        req.user,
        cartItemId
    );
  }
}