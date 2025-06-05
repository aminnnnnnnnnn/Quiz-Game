import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ConnectedUser } from '../../model/ConnectedUser';

@Injectable()
export class ConnectedUserService {
  private readonly connectedUserRepository: Repository<ConnectedUser>;
  constructor(private entityManager: EntityManager) {
    this.connectedUserRepository = entityManager.getRepository(ConnectedUser);
  }

  //ToDo: Fehler beim Einloggen manchmal. Unique constraint connecteduser.useriduserid
  async create(socketId: string, user_id: number): Promise<ConnectedUser> {
    const connectedUser: ConnectedUser = await ConnectedUser.create(
      socketId,
      user_id,
    );
    return this.connectedUserRepository.save(connectedUser);
  }

  async getAllConnectedUsers(): Promise<ConnectedUser[]> {
    return this.connectedUserRepository.find();
  }


  async findByUser(user_id: number): Promise<ConnectedUser | undefined> {
    const connections = await this.connectedUserRepository.findOne({
      where: {
        user_id: user_id,
      },
      relations: ['user_id']
    });

    return connections;
  }


  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.connectedUserRepository.createQueryBuilder().delete().execute();
  }
}
