import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ProductVariant } from './productVariant.entity';

@Entity()
export class ProductSize {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, productVar => productVar.sizes, { onDelete: 'CASCADE' })
  productVariant: ProductVariant;

  @Column({ type: 'varchar', length: 6 })
  size: string;

  @Column()
  stock: number;
}