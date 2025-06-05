import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Category } from './Category';
import { Game } from './Game'; // Deine Game-Entität

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  questionId: number;

  @Column('text')
  question: string;

  @Column('text')
  answer1: string;

  @Column('text')
  answer2: string;

  @Column('text')
  answer3: string;

  @Column('text')
  answer4: string;

  @Column()
  solution: number;

  @ManyToMany(() => Category, (category) => category.questions, {
    cascade: true,
  })
  @JoinTable({ name: 'question_category' })
  categories: Category[];

  @ManyToMany(() => Game, (game) => game.questions, { nullable: true})
  game: Game[];

  @Column({ default: false })
  isAnswered: boolean;

  public static create(
    question: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string,
    solution: number,
    categories: Category[],
  ): Question {
    const q = new Question();
    q.question = question;
    q.answer1 = answer1;
    q.answer2 = answer2;
    q.answer3 = answer3;
    q.answer4 = answer4;
    q.solution = solution;
    q.categories = categories;
    q.isAnswered = false; // Initial ist die Frage nicht beantwortet
    return q;
  }
}
