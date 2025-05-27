import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

@Entity()
export class DeliveryPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Column()
  @IsPhoneNumber('RU')
  contactNumber: string;

  @Column({ default: false })
  isDoorDelivery: boolean;

  @OneToMany(() => Order, (order) => order.deliveryPoint)
  orders: Order[];
}