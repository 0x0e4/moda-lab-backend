import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductVariant } from './productVariant.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => ProductVariant, variant => variant.images, { onDelete: 'CASCADE' })
  variant: ProductVariant;
}