import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Index, PrimaryColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class CategoryAttrib {
  @ManyToOne(() => Category, category => category.attributes)
  category: Category;

  @Column({ nullable: true })
  @PrimaryColumn()
  categoryId: number;

  @Column()
  @PrimaryColumn()
  attribName: string;
}