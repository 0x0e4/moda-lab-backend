import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Category } from './category.entity';
import { Attribute } from './attribute.entity';

@Entity()
export class CategoryAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, category => category.categoryAttributes, { onDelete: 'CASCADE' })
  category: Category;

  @ManyToOne(() => Attribute, attribute => attribute.categoryAttributes, { onDelete: 'CASCADE' })
  attribute: Attribute;

  @Column({ default: true })
  isFilterable: boolean; // Можно использовать для фильтров
}