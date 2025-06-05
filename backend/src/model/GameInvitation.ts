import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique} from 'typeorm';
import { User } from './User';

@Entity()
//@Unique(["sender_id", "friend_id"])
export class GameInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  sender_id: number;

  @ManyToOne(() => User, { nullable: false})
  //@JoinColumn({ name: "friend_id" })
  friend_id: number;

  @Column({nullable: true})
  senderUsername: string;

  @Column({ default: false })
  accepted: boolean;

  @Column({ default: false })
  declined: boolean;
}
