import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { Repository, DataSource } from 'typeorm';
import { AuthCredentialsDto } from './auth.creations.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialDTO: AuthCredentialsDto): Promise<void> {
    const { password, username } = authCredentialDTO;

    const salt = await bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      user: username,
      password: hashedPassword,
    });
    try {
      await this.save(user);
    } catch (error) {
      throw error.code === '23505'
        ? new ConflictException('Username already exists!')
        : new InternalServerErrorException();
    }
  }
}
