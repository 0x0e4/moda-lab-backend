import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { DeliveryPoint } from './delpoint.entity';
import { User } from './user.entity';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum OrderStatus {
  PROCESSING = 'processing', // Обработка
  IN_DELIVERY = 'in_delivery', // В доставке
  DELIVERED_TO_PICKUP = 'delivered_to_pickup', // Доставлено в пункт выдачи
  RECEIVED = 'received', // Получено
  CANCELLED = 'cancelled', // Отменено
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ManyToOne(() => DeliveryPoint, (deliveryPoint) => deliveryPoint.orders)
  deliveryPoint: DeliveryPoint;

  @ManyToMany(() => Product, (product) => product.orders)
  @JoinTable()
  products: Product[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PROCESSING,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ManyToOne(() => User, user => user.orders) // Связь с пользователем
  user: User; // Пользователь, который сделал заказ

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  // Метод для проверки, может ли заказ иметь статус "Доставлено в пункт выдачи"
  canBeDeliveredToPickup(): boolean {
    return !this.deliveryPoint.isDoorDelivery;
  }
}