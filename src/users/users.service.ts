import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { ProductVariant } from 'src/entities/productVariant.entity';

export interface FavoriteItem {
  id: number;
  variantId: number;
  sizeId: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {}

  async createUser (createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async updateUser (id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.getUserById(id); // Проверяем, существует ли пользователь
    await this.userRepository.update(id, updateUserDto);
    return this.getUserById(id); // Возвращаем обновленного пользователя
  }

  async deleteUser (id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }

  async getWishlist(user: User): Promise<number[]> {
    const wishlist = (await this.userRepository.findOne({ where: { id: user.id }, relations: ['wishlist']}))?.wishlist

    return wishlist?.map((value) => value.id) || []
  }

  async addToWishlist(user: User, variantId: number): Promise<User> {
    const product = await this.productVariantRepository.findOne({ where: { id: variantId } });
    user = await this.userRepository.findOne({ where: { id: user.id }, relations: ['wishlist']}) || user

    if (!product) {
      throw new NotFoundException(`Product variant with ID ${variantId} not found`);
    }

    if(user.wishlist.indexOf(product) == -1)
      user.wishlist.push(product);
    return await this.userRepository.save(user);
  }

  async removeFromWishlist(user: User, variantId: number): Promise<User> {
    user.wishlist = user.wishlist.filter(productVariant => productVariant.id !== variantId);
    return await this.userRepository.save(user);
  }
}