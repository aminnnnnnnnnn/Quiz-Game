import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Question } from './Question';
import {Category} from "./Category";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  gameId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'player1Id' })
  player1: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'player2Id' })
  player2: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'winnerId' })
  winner: number;

  @Column({ default: 0 })
  round: number;

  @Column({ default: 0 })
  player1Score: number;

  @Column({ default: 0 })
  player2Score: number;

  @Column({ default: false })
  finished: boolean;

  @ManyToMany(() => Question, (question) => question.game, { cascade: true })
  @JoinTable({ name: 'game_questions'})
  questions: Question[];

  //@ManyToOne(() => Question, { nullable: true })
  //currentQuestion: Question;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'currentPlayerId' })
  currentPlayer: User;

  @Column({ nullable: true })
  selectedAnswer: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @JoinColumn({name: "question1"})
  question1: number;

  @Column()
  @JoinColumn({name: "question2"})
  question2: number;

  @Column()
  @JoinColumn({name: "question3"})
  question3: number;

  @Column()
  @JoinColumn({name: "question4"})
  question4: number;

  @Column()
  @JoinColumn({name: "question5"})
  question5: number;

  @Column()
  @JoinColumn({name: "question6"})
  question6: number;

  @Column()
  @JoinColumn({name: "question7"})
  question7: number;

  @Column()
  @JoinColumn({name: "question8"})
  question8: number;

  @Column()
  @JoinColumn({name: "question9"})
  question9: number;

  @Column()
  @JoinColumn({name: "question10"})
  question10: number;


}
