import {Injectable, UnauthorizedException} from '@nestjs/common';
import {EntityManager, Repository} from 'typeorm';
import {User} from '../../model/User';
import {ISession} from '../../model/ISession';
import {MessageResultDto} from '../../dto/MessageResultDto';
import {LoginUserDto} from '../../dto/LoginUserDto';
import {LoginResultDto} from '../../dto/LoginResultDto';
import * as jwt from 'jsonwebtoken';
import {Jwt} from 'jsonwebtoken';

@Injectable()
export class AuthService {
    private readonly userRepository: Repository<User>;

    constructor(private entityManager: EntityManager) {
        this.userRepository = entityManager.getRepository(User);
    }

    private generateJwtToken(user: User): string {
        const payload = {
            userId: user.user_id,
            isAdmin: user.isAdmin,
            username: user.username,
        };
        return jwt.sign(payload, 'your-secret-key', {expiresIn: '1h'});
    }

    async login(session: ISession, body: LoginUserDto): Promise<LoginResultDto> {
        try {
            if (session.user) {
                return new LoginResultDto(null, null, 'User is already logged in.');
            } else {
                if (!body || !body.email || !body.password) {
                    return new LoginResultDto(null, null, 'Invalid input data.');
                }

                const user: User | null = await this.userRepository.findOneBy({
                    email: body.email,
                    password: body.password,
                });

                if (user != null) {
                    session.user = user;

                    if (user.isAdmin) {
                        session.isAdmin = true;
                    }
                    const token: string = this.generateJwtToken(user);
                    return new LoginResultDto(user, token, 'Login Successful.');
                } else {
                    return new LoginResultDto(null, null, 'Invalid email or password.');
                }
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async logout(session: ISession): Promise<MessageResultDto> {
        if (session.user != undefined) {


            await this.userRepository.query(
                `DELETE
                 FROM connected_user
                 WHERE userIdUserId = ${session.user.user_id};`
            );


            session.user = undefined;
            session.isAdmin = false;
            return new MessageResultDto(`The user has been logged out.`);
        } else {
            return new MessageResultDto('No user is logged in.');
        }
    }
}
