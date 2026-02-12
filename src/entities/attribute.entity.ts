import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AttributeValue } from './attributeValue.entity';
import { CategoryAttribute } from './categoryAttribute.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string; // Цвет, Размер, Материал и т.д.

  @OneToMany(() => AttributeValue, value => value.attribute)
  values: AttributeValue[];

  @OneToMany(() => CategoryAttribute, ca => ca.attribute)
  categoryAttributes?: CategoryAttribute[];
}