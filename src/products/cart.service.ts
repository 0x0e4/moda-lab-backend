import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductVariant } from 'src/entities/productVariant.entity';
import { User } from 'src/entities/user.entity';
import { ProductCart } from 'src/entities/productCart.entity';
import { AddCartItemDto, UpdateCartItemDto } from 'src/dto/cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(ProductCart)
        private cartRepository: Repository<ProductCart>,
        @InjectRepository(ProductVariant)
        public productVariantsRepository: Repository<ProductVariant>,
    ) { }

    async getCartItems(user: User): Promise<ProductCart[]> {
        return this.cartRepository.find({ where: { user: user }, relations: ['productVariant', 'size'] })
    }

    async addCartItem(user: User, addCartItemDto: AddCartItemDto): Promise<ProductCart | null> {
        const { variantId, sizeId, quantity } = addCartItemDto

        const prodVar = await this.productVariantsRepository.findOne({ where: { id: variantId }, relations: ['sizes'] })
        if (!prodVar)
            throw new NotFoundException(`Product variant with ID ${variantId} not found`)
        let sizeIndex = 0
        if (sizeId != null) {
            if ((sizeIndex = prodVar.sizes.findIndex((value) => value.id == sizeId)) == -1)
                throw new NotFoundException(`Product variant with size ID ${sizeId} not found`)
            if (prodVar.sizes[sizeIndex].stock < quantity)
                throw new ConflictException(`Not enough items in stock`)
        }

        const dublicateCheck = await this.cartRepository.findOneBy({ user: user, productVariant: prodVar, size: sizeId == null ? undefined : prodVar.sizes[sizeIndex] })
        if(dublicateCheck)
            throw new ConflictException(`Cart item with this product already exists`)

        const cartItem = await this.cartRepository.create({ user: user, productVariant: prodVar, size: sizeId != null ? prodVar.sizes[sizeIndex] : undefined, quantity: quantity })
        const saved = await this.cartRepository.save(cartItem)
        return this.cartRepository.findOne({
            where: { id: saved.id }, 
            relations: ['productVariant', 'size']
        });
    }

    async updateCartItem(user: User, updateCartItemDto: UpdateCartItemDto): Promise<ProductCart> {
        const { id, quantity } = updateCartItemDto

        const cartItem = await this.cartRepository.findOneBy({ id: id, user: user })
        if (!cartItem)
            throw new NotFoundException(`Cart item with ID ${id} not found`)

        cartItem.quantity = quantity
        return this.cartRepository.save(cartItem)
    }

    async removeCartItem(user: User, cartItemId: number): Promise<ProductCart> {
        const cartItem = await this.cartRepository.findOneBy({ id: cartItemId, user: user })
        if (!cartItem)
            throw new NotFoundException(`Cart item with ID ${cartItemId} not found`)

        return this.cartRepository.remove(cartItem)
    }
}