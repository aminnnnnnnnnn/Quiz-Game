import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MessageResultDto } from '../../dto/MessageResultDto';
import { GetUserDto } from '../../dto/GetUserDto';
import { PostUserDto } from '../../dto/PostUserDto';
import { PutUserDto } from '../../dto/PutUserDto';
import { ISession } from '../../model/ISession';
import { LoginResultDto } from '../../dto/LoginResultDto';
import { UserIdGuard } from '../../user-id/user-id.guard';
import { GetFriendsDto } from '../../dto/GetFriendsDto';
import { IsLoggedInGuard } from '../../is-logged-in/is-logged-in.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async postUser(@Body() body: PostUserDto): Promise<MessageResultDto> {
    return this.userService.createUser(body);
  }

  @Get('/:user_id')
  @UseGuards(UserIdGuard)
  async getUser(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<GetUserDto> {
    return this.userService.getUser(user_id);
  }

  //updated version of add friend, now by username
  @Post('add-friend/:user_id/:username')
  @UseGuards(UserIdGuard)
  async addFriend(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('username') username: string,
  ): Promise<MessageResultDto> {
    return this.userService.addFriend(user_id, username);
  }

  @Put('/:user_id')
  @UseGuards(UserIdGuard)
  async editUser(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Session() session: ISession,
    @Body() body: PutUserDto,
  ): Promise<MessageResultDto> {
    return this.userService.editUser(session, body);
  }

  @Delete('/:user_id')
  @UseGuards(UserIdGuard)
  async deleteUser(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Session() session: ISession,
  ): Promise<MessageResultDto> {
    return this.userService.deleteUser(session);
  }

  //Freundesliste ausgeben
  @Get('friends/:user_id')
  @UseGuards(UserIdGuard)
  async getFriends(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Session() session: ISession,
  ): Promise<GetFriendsDto[]> {
    return this.userService.getFriends(session);
  }

  //Freund löschen
  @Delete('friends/:user_id')
  @UseGuards(IsLoggedInGuard)
  async deleteFriend(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Session() session: ISession,
  ): Promise<MessageResultDto> {
    return this.userService.deleteFriend(session, user_id);
  }
}

//ToDo: Falls keine session.user_id existiert, abbrechen im userIdGuard
//ToDo: Date beim Post und Put funktioniert nicht
