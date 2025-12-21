import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @IsNotEmpty()
  address: string;

  @Column({ type: 'varchar', length: 20 })
  @IsPhoneNumber('RU')
  contactNumber: string;

  @OneToMany(() => Order, (order) => order.userAddress)
  orders: Order[];
}