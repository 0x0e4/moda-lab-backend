import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Attribute } from './attribute.entity';

@Entity()
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  value: string; // Красный, S, M, Хлопок и т.д.

  @ManyToOne(() => Attribute, attribute => attribute.values, { onDelete: 'CASCADE' })
  attribute: Attribute;
}