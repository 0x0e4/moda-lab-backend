import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductVariant } from './productVariant.entity';
import { AttributeValue } from './attributeValue.entity';

@Entity()
export class ProductAttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, variant => variant.attributeValues, { onDelete: 'CASCADE' })
  variant: ProductVariant;

  @ManyToOne(() => AttributeValue, { onDelete: 'CASCADE' })
  value: AttributeValue;
}