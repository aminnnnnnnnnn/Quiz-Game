import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class FriendshipRequest {
  @PrimaryGeneratedColumn()
  FriendRequestId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @CreateDateColumn()
  requestDate: Date;
}

//ToDo: muss noch eingebunden werden, sodass nicht direkt die freundschaft eingetragen wird beim request
