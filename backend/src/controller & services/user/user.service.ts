import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../../model/User';
import { GetUserDto } from '../../dto/GetUserDto';
import { MessageResultDto } from '../../dto/MessageResultDto';
import { PutUserDto } from 'src/dto/PutUserDto';
import { PostUserDto } from 'src/dto/PostUserDto';
import { ISession } from '../../model/ISession';
import { GetFriendsDto } from '../../dto/GetFriendsDto';
import { GetUserByIdDto } from '../../dto/GetUserByIdDto';

@Injectable()
export class UserService {
  protected readonly userRepository: Repository<User>;

  constructor(private entityManager: EntityManager) {
    this.userRepository = entityManager.getRepository(User);
  }

  async getUser(user_id: number): Promise<GetUserDto> {
    try {
      const user: User | null = await this.userRepository.findOneBy({
        user_id: user_id,
      });
      if (user == null) {
        throw new NotFoundException();
      }
      return new GetUserDto(
        user.user_id,
        user.email,
        user.password,
        user.username,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteUser(session: ISession): Promise<MessageResultDto> {
    try {
      const user: User | null = await this.userRepository.findOneBy({
        user_id: session.user.user_id,
      });
      if (user == null) {
        throw new NotFoundException();
      }
      session.user = undefined;
      await this.userRepository.remove(user);
      return new MessageResultDto(
        `The user ${user.username} has been deleted successfully!`,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async addFriend(user_id: number, username: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: user_id },
      relations: ['friends'],
    });
    const friend = await this.userRepository.findOne({
      where: { username: username },
    });

    if (user.friends.find((user) => user.user_id == friend.user_id)) {
      console.log('user existiert bereits');
      throw new HttpException(
        `You are already friends with ${friend.username}`,
        HttpStatus.I_AM_A_TEAPOT,
      );
    } else {
      console.log('user existiert noch nicht');
    }

    if (!user || !friend) {
      throw new NotFoundException('Player or friend not found.');
    }

    if (user.user_id == friend.user_id) {
      throw new HttpException(
        'You cant add yourself as a friend, lol',
        HttpStatus.FORBIDDEN,
      );
    }
    user.friends.push(friend);
    await this.userRepository.save(user);
    return new MessageResultDto(
      `Friend: ${friend.username} added successfully!`,
    );
  }

  async editUser(
    session: ISession,
    body: PutUserDto,
  ): Promise<MessageResultDto> {
    try {
      const user: User | null = await this.userRepository.findOneBy({
        user_id: session.user.user_id,
      });
      if (user == null) {
        throw new NotFoundException();
      }
      user.username = body.username;
      user.email = body.email;
      await this.userRepository.save(user);
      return new MessageResultDto(
        `The user: ${user.username} was successfully edited!`,
      );
    } catch (e) {
      throw e;
    }
  }

  async createUser(body: PostUserDto): Promise<MessageResultDto> {
    try {
      const user = User.create(body.username, body.password, body.email);
      await this.userRepository.save(user);
      return new MessageResultDto('User creation was successful.');
    } catch (e) {
      console.log('e ' + e);
      console.log('e code ' + e.code);
      if (e.code === 'SQLITE_CONSTRAINT') {
        return new MessageResultDto('Email or Username already exists.');
      }
      throw new Error(e);
    }
  }

  async updatePlayer(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async getFriends(session: ISession): Promise<GetFriendsDto[]> {
    try {
      const id: number = session.user.user_id;
      const friends: GetFriendsDto[] = await this.userRepository.query(
        `SELECT DISTINCT u.user_id, u.username 
                 FROM user u 
                 JOIN friendship f 
                 ON (u.user_id = f.userUserId_1 OR u.user_id = f.userUserId_2) 
                 WHERE (f.userUserId_1 = ${id} OR f.userUserId_2 = ${id}) 
                 AND u.user_id != ${id};`,
      );
      if (friends.length == 0) {
        throw new NotFoundException('Du hast keine Freunde! haha');
      }
      console.log(friends);
      return friends;
    } catch (e) {
      console.log('e ' + e);
      console.log('e code ' + e.code);
      throw e;
    }
  }

  async getUserById(user_id: number): Promise<GetUserByIdDto> {
    try {
      const user: User | null = await this.userRepository.findOneBy({
        user_id: user_id,
      });
      if (user == null) {
        throw new NotFoundException();
      }
      return new GetUserByIdDto(user.user_id, user.username);
    } catch (e) {
      throw new Error(e);
    }
  }

  //Deletes a friend by the given friend_id for the user saved in the session
  async deleteFriend(
    session: ISession,
    friend_id: number,
  ): Promise<MessageResultDto> {
    try {
      //Query löscht Eintrag in Freundschaft
      await this.userRepository.query(
        `DELETE FROM friendship WHERE (userUserId_1 = ${session.user.user_id} AND userUserId_2 = ${friend_id}) OR (userUserId_1 = ${friend_id} AND userUserId_2 = ${session.user.user_id})`,
      );
      return new MessageResultDto(
        `The friend has been removed from friendlist successfully!`,
      );
    } catch (Error) {
      console.log(Error);
      throw Error;
    }
  }
}
