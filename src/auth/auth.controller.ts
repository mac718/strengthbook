import { Controller, Post, Body, Response, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { EditProfileDto } from 'src/users/dto/edit-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    editPropfileDto: EditProfileDto,
  ) {
    await this.usersService.createUser(createUserDto, editPropfileDto);
    let signInUserDto: SigninUserDto = {
      email: createUserDto.email,
      password: createUserDto.password,
    };

    console.log(signInUserDto);
    return await this.authService.validateUserByPassword(signInUserDto);
  }

  @Post()
  async login(@Body() signinUserDto: SigninUserDto) {
    //console.log(signinUserDto);
    return await this.authService.validateUserByPassword(signinUserDto);
  }
}
