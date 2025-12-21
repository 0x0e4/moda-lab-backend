import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserAddress } from './userAddress.entity';
import { DeliveryPoint } from './delpoint.entity';
import { OrderItem } from './orderItem.entity';

export enum OrderStatus {
  PROCESSING = 'processing',
  IN_DELIVERY = 'in_delivery',
  DELIVERED_TO_PICKUP = 'delivered_to_pickup',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToOne(() => UserAddress, { nullable: true })
  userAddress?: UserAddress;

  @ManyToOne(() => DeliveryPoint, { nullable: true })
  deliveryPoint?: DeliveryPoint;

  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;
}