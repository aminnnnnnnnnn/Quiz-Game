import { Module } from '@nestjs/common';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/User';
import { Question } from './model/Question';
import { Category } from './model/Category';
import { FriendshipRequest } from './model/FriendshipRequest';
import { UserService } from './controller & services/user/user.service';
import { GameService } from './controller & services/game/game.service';
import { AuthService } from './controller & services/authentication/auth.service';
import { UserController } from './controller & services/user/user.controller';
import { GameController } from './controller & services/game/game.controller';
import { AuthController } from './controller & services/authentication/auth.controller';
import { Game } from './model/Game';
import { AdminController } from './controller & services/admin/admin.controller';
import { AdminService } from './controller & services/admin/admin.service';
import { GameGateway } from './controller & services/game/game.gateway';
import { GameInvitation } from './model/GameInvitation';
import { jwtConfig } from './jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { StatisticsController } from './controller & services/statistics/statistic.controller';
import { StatisticService } from './controller & services/statistics/statistic.service';
import { ConnectedUser } from './model/ConnectedUser';
import { ConnectedUserService } from './controller & services/connected-user/connectedUserService';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        '..',
        '..',
        'frontend',
        'dist',
        'frontend',
      ),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './src/db/db.sqlite',
      entities: [
        User,
        Question,
        Category,
        FriendshipRequest,
        Game,
        GameInvitation,
        ConnectedUser,
      ],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([
      Game,
      User,
      Category,
      Question,
      GameInvitation,
      GameGateway,
      ConnectedUser,
    ]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [
    AppController,
    UserController,
    GameController,
    AuthController,
    AdminController,
    StatisticsController,
  ],
  providers: [
    AppService,
    UserService,
    GameService,
    AuthService,
    AdminService,
    StatisticService,
    GameGateway,
    ConnectedUserService,
  ],
})
export class AppModule {}
