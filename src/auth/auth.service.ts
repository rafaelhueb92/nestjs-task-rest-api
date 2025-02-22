import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './auth.creations.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialDTO: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialDTO);
  }

  async singIn(
    authCredentialDTO: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { password, username } = authCredentialDTO;
    const user = await this.userRepository.findOne({
      where: { user: username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials!');
    }
  }
}
