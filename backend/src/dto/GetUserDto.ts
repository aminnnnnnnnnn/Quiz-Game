import {ApiProperty} from "@nestjs/swagger";

export class GetUserDto {

  public user_id: number;

  public email: string;

  public password: string;

  public username: string;

  constructor(id: number, email: string, password: string, username: string) {
    this.user_id = id;
    this.email = email;
    this.password = password;
    this.username = username;
  }
}
