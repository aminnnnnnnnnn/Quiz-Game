import { IsString, MinLength } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class PostUserDto {
  @ApiProperty()
  @IsString()
  public username: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  public password: string;

  @ApiProperty()
  @IsString()
  public email: string;
}
