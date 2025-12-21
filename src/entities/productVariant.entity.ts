import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { ProductAttributeValue } from './productAttributeValue.entity';
import { ProductImage } from './productImage.entity';
import { ProductSize } from './productSize.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.variants, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => ProductImage, image => image.variant)
  images: ProductImage[];

  @OneToMany(() => ProductSize, size => size.productVariant)
  sizes: ProductSize[];

  @OneToMany(() => ProductAttributeValue, pav => pav.variant)
  attributeValues: ProductAttributeValue[];
}