import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Question } from './Question';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  category: string;

  @ManyToMany(()=>Question, (question)=>question.categories)
  questions: Question[];

  static create(category: string): Category {
    const c = new Category();
    c.category = category;
    return c;
  }
}
