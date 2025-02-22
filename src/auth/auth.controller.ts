import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './auth.creations.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signUp(@Body() authCredentialsDTO: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDTO);
  }
  @Post('/signin')
  async signIn(
    @Body() authCredentialsDTO: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.singIn(authCredentialsDTO);
  }
}
