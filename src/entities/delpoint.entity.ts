import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

@Entity('delivery_point')
export class DeliveryPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @IsNotEmpty()
  address: string;

  @Column({ type: 'varchar', length: 20 })
  @IsPhoneNumber('RU')
  contactNumber: string;

  @OneToMany(() => Order, (order) => order.deliveryPoint)
  orders: Order[];
}