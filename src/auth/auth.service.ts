import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './auth.creations.dto';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signUp(authCredentialDTO: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialDTO);
  }
}
