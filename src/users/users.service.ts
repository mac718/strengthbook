import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, IProfile } from './user.schema';
import { Model } from 'mongoose';
import { EditProfileDto } from './dto/edit-profile.dto';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { create } from 'domain';
import { setServers } from 'dns';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    @InjectModel('Profile') private profileModel: Model<IProfile>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    editProfileDto: EditProfileDto,
  ) {
    const user = await this.userModel.create(createUserDto);
    user.profile = await new this.profileModel(editProfileDto);
    user.profile.firstName = createUserDto.firstName;
    user.profile.lastName = createUserDto.lastName;

    await user.save((err, user) => {
      if (err) {
        throw new InternalServerErrorException('Could not create account.');
      }
    });

    console.log('shmerp', user);
    return user;
  }

  async editProfile(user: Model<IUser>, editProfileDto: EditProfileDto) {
    console.log(editProfileDto);
    user.profile.firstName = editProfileDto.firstName;
    user.profile.lastName = editProfileDto.lastName;
    user.profile.bodyweight = editProfileDto.bodyweight;
    user.profile.dob = editProfileDto.dob;

    user.save((err, user) => {
      if (err) {
        throw new InternalServerErrorException('profile could not be saved.');
      }
    });
  }

  async createWorkout(user: Model<IUser>, createWorkoutDto: CreateWorkoutDto) {
    //createWorkoutDto.date = new Date(createWorkoutDto.date);

    console.log(createWorkoutDto);

    let keys = Object.keys(createWorkoutDto);

    let workout = [];

    keys.forEach(key => {
      JSON.parse(createWorkoutDto[key]).forEach(set => {
        workout.push(set);
      });
    });

    console.log('workout', workout);

    user.workouts = [
      ...user.workouts,
      { date: createWorkoutDto.date, sets: workout },
    ];
    //console.log(createWorkoutDto.sets);

    user.save((err, user) => {
      if (err) {
        throw new InternalServerErrorException(
          'workout could not be saved.',
          err,
        );
      }
    });
  }

  async findOneByEmail(email): Model<IUser> {
    return await this.userModel.findOne({ email });
  }
}
