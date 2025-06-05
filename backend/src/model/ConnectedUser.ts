import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany, OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class ConnectedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @OneToOne(() => User,)
  @JoinColumn()
  user_id: number;

  public static create(socketId: string, userId: number): ConnectedUser {
    const connectedUser = new ConnectedUser();
    connectedUser.socketId = socketId;
    connectedUser.user_id = userId;
    return connectedUser;
  }
}
