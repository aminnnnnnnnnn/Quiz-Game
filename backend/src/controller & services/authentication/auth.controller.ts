import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ISession } from '../../model/ISession';
import { MessageResultDto } from '../../dto/MessageResultDto';
import { LoginUserDto } from '../../dto/LoginUserDto';
import { LoginResultDto } from '../../dto/LoginResultDto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Session() session: ISession,
    @Body() body: LoginUserDto,
  ): Promise<LoginResultDto> {
    return this.authService.login(session, body);
  }

  @Post('logout')
  async logout(@Session() session: ISession): Promise<MessageResultDto> {
    return this.authService.logout(session);
  }
}
