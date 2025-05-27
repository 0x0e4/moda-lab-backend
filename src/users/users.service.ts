import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto'; // Импортируем DTO

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
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

  async addToWishlist(user: User, productId: number): Promise<User> {
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    user.wishlist.push(product);
    return await this.userRepository.save(user);
  }

  async removeFromWishlist(user: User, productId: number): Promise<User> {
    user.wishlist = user.wishlist.filter(product => product.id !== productId);
    return await this.userRepository.save(user);
  }
}