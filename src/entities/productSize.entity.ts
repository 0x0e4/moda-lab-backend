import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ProductVariant } from './productVariant.entity';
import { ProductSizeItem } from './productSizeItem.entity';

@Entity()
export class ProductSize {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, productVar => productVar.sizes, { onDelete: 'CASCADE' })
  productVariant: ProductVariant;

  @ManyToOne(() => ProductSizeItem, prodSide => prodSide.items)
  size: ProductSizeItem;

  @Column()
  stock: number;
}