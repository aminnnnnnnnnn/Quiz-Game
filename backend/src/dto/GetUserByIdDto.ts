export class GetUserByIdDto {
  public user_id: number;
  public username: string;
  constructor(id: number, username: string) {
    this.user_id = id;
    this.username = username;
  }
}
