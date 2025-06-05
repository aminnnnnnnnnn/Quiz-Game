import { User } from './User';

export interface ConnectedUserI {
  id?: number;
  socketId: string;
  user: User;
}
