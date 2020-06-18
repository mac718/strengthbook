import { Controller, Post, Body, Get, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './user.interface';
import { EditProfileDto } from './dto/edit-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Post()
  // async createUser(
  //   @Body() createUserDto: CreateUserDto,
  //   editProfileDto: EditProfileDto,
  // ) {
  //   return await this.usersService.createUser(createUserDto, editProfileDto);
  // }

  @Patch('edit-profile')
  @UseGuards(AuthGuard('jwt'))
  async editProfile(@GetUser() user, @Body() editProfileDto: EditProfileDto) {
    //console.log(user);
    return await this.usersService.editProfile(user, editProfileDto);
  }

  @Post('/getuser')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Body() email): Promise<User> {
    const user = await this.usersService.findOneByEmail(email.email);
    console.log(user);
    return user;
  }

  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  testAuthRoute(@GetUser() user: User) {
    console.log(user);
  }
}
