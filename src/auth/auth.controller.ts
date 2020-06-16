import { Controller, Post, Body, Response, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from '../users/dto/signin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(@Body() signinUserDto: SigninUserDto) {
    return await this.authService.validateUserByPassword(signinUserDto);
  }
}
