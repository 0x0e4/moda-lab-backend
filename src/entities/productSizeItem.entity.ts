import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ProductVariant } from './productVariant.entity';
import { ProductSize } from './productSize.entity';

@Entity()
export class ProductSizeItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  size: string;

  @OneToMany(()=> ProductSize, prodSize => prodSize.size)
  items: ProductSize[];
}