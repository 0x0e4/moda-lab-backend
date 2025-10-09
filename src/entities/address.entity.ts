import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Unique, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @Column()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Column()
  @IsPhoneNumber('RU')
  contactNumber: string;

  @OneToMany(() => Order, (order) => order.userAddress)
  orders: Order[];
}