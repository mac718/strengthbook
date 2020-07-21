import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, IProfile } from './user.schema';
import { Model } from 'mongoose';
import { EditProfileDto } from './dto/edit-profile.dto';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { rpeChart } from './rpeChart';

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
    console.log(createWorkoutDto);
    let keys = Object.keys(createWorkoutDto.sets);

    let workout = [];

    keys.forEach(key => {
      JSON.parse(createWorkoutDto.sets[key]).forEach(set => {
        workout.push(set);
      });
    });

    workout.forEach(set => {
      let rpeArr = rpeChart[set.rpe];

      let percentage = rpeArr.filter(rpe => {
        return rpe.reps === set.reps;
      })[0];

      let e1rm = set.weight * (100 / percentage.percentage);

      console.log(percentage.percentage, e1rm);
      set.e1rm = e1rm;

      let movement = set.movement;
      console.log('thingy', user.prs);

      let pr = user.prs.filter(pr => {
        return pr.movement === movement;
      })[0];

      console.log('pr', pr);
      if (pr && pr.weight < set.e1rm) {
        console.log('pr', set.e1rm);
        pr.weight = set.e1rm;
        let prIndex;
        user.prs.forEach((pr, i) => {
          if (pr.movement === movement) {
            prIndex = i;
          }
        });
        user.prs.splice(prIndex, 1, pr);
      } else if (!pr) {
        console.log('e1rm2', set.e1rm);

        pr = {
          movement: movement,
          weight: set.e1rm,
          date: createWorkoutDto.date,
        };
        console.log('pr2', pr);
        user.prs = [...user.prs, pr];
      }
    });

    console.log('workout', workout);

    user.workouts = [
      ...user.workouts,
      { date: createWorkoutDto.date, sets: workout },
    ];

    await user.save((err, user) => {
      if (err) {
        throw new InternalServerErrorException(
          'workout could not be saved.',
          err,
        );
      }
    });
  }

  async editWorkout(user: Model<IUser>, createWorkoutDto: CreateWorkoutDto) {}

  async findOneByEmail(email): Model<IUser> {
    return await this.userModel.findOne({ email });
  }
}
