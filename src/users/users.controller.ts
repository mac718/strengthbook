import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Put,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './user.interface';
import { EditProfileDto } from './dto/edit-profile.dto';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { ExportWorkoutDto } from './dto/export-workout.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('edit-profile')
  @UseGuards(AuthGuard('jwt'))
  async editProfile(@GetUser() user, @Body() editProfileDto: EditProfileDto) {
    return await this.usersService.editProfile(user, editProfileDto);
  }

  @Post('new-workout')
  @UseGuards(AuthGuard('jwt'))
  async createWorkout(
    @GetUser() user,
    @Body() createWorkoutDto: CreateWorkoutDto,
  ) {
    return await this.usersService.createWorkout(user, createWorkoutDto);
  }

  @Put('edit-workout/:id')
  @UseGuards(AuthGuard('jwt'))
  async editWorkout(
    @GetUser() user,
    @Body() createWorkoutDto: CreateWorkoutDto,
    @Param() params,
  ) {
    console.log('user', user);
    return await this.usersService.editWorkout(
      user,
      createWorkoutDto,
      params.id,
    );
  }

  @Post('export')
  @UseGuards(AuthGuard('jwt'))
  async exportWorkout(
    @GetUser() user,
    @Body() exportWorkoutDto: ExportWorkoutDto,
  ) {
    return await this.usersService.exportWorkout(user, exportWorkoutDto);
  }

  @Post('/getuser')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Body() email): Promise<User> {
    const user = await this.usersService.findOneByEmail(email.email);
    console.log(user);
    return user;
  }
}
