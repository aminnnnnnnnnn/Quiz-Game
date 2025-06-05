import { User } from '../model/User';

export class LoginResultDto {
  user: User;
  token: string;
  message: string;

  constructor(user: User, token: string, message: string) {
    this.user = user;
    this.token = token;
    this.message = message;
  }
}
