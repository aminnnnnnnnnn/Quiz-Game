import {
  Column,
  Entity,
  JoinTable,
  ManyToMany, ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ConnectedUser } from './ConnectedUser';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  password: string;

  @Column({ length: 20, unique: true })
  username: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({ name: 'friendship' })
  friends: User[];

  public static create(
    username: string,
    password: string,
    email: string,
  ): User {
    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    return user;
  }
}

//ToDo: IsOnline löschen?
