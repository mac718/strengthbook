import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, IProfile, ISet } from './user.schema';
import { Model } from 'mongoose';
import { EditProfileDto } from './dto/edit-profile.dto';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { rpeChart } from './rpeChart';
import { ExportWorkoutDto } from './dto/export-workout.dto';
import { create } from 'domain';

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

    this.calculatePrs(createWorkoutDto.date, workout, user);

    // workout.forEach(set => {
    //   let rpeArr = rpeChart[set.rpe];

    //   let percentage = rpeArr.filter(rpe => {
    //     return rpe.reps === set.reps;
    //   })[0];

    //   let e1rm = set.weight * (100 / percentage.percentage);

    //   set.e1rm = e1rm;

    //   let movement = set.movement;

    //   let pr = user.prs.filter(pr => {
    //     return pr.movement === movement;
    //   })[0];

    //   if (pr && pr.weight < set.e1rm) {
    //     pr.weight = set.e1rm;
    //     let prIndex;
    //     user.prs.forEach((pr, i) => {
    //       if (pr.movement === movement) {
    //         prIndex = i;
    //       }
    //     });
    //     user.prs.splice(prIndex, 1, pr);
    //   } else if (!pr) {
    //     pr = {
    //       movement: movement,
    //       weight: set.e1rm,
    //       date: createWorkoutDto.date,
    //     };
    //     user.prs = [...user.prs, pr];
    //   }
    // });

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

  async editWorkout(
    user: Model<IUser>,
    createWorkoutDto: CreateWorkoutDto,
    workoutId: string,
  ) {
    let keys = Object.keys(createWorkoutDto.sets);

    console.log('createWorkoutDto', createWorkoutDto);

    console.log(
      'bench',
      JSON.parse(JSON.stringify(createWorkoutDto.sets['Competition Bench-1'])),
    );

    let editedWorkout = [];

    keys.forEach(key => {
      JSON.parse(createWorkoutDto.sets[key]).forEach(set => {
        editedWorkout.push(set);
      });
    });

    let savedWorkout = user.workouts.filter(
      workout => JSON.stringify(workout._id) === JSON.stringify(workoutId),
    )[0];

    savedWorkout.date = createWorkoutDto.date;
    savedWorkout.sets = editedWorkout;

    this.calculatePrs(createWorkoutDto.date, savedWorkout.sets, user);

    // savedWorkout.sets.forEach(set => {
    //   let rpeArr = rpeChart[set.rpe];

    //   let percentage = rpeArr.filter(rpe => {
    //     return rpe.reps === set.reps;
    //   })[0];

    //   let e1rm = set.weight * (100 / percentage.percentage);

    //   set.e1rm = e1rm;

    //   let movement = set.movement;

    //   let pr = user.prs.filter(pr => {
    //     return pr.movement === movement;
    //   })[0];

    //   if (pr && pr.weight < set.e1rm) {
    //     pr.weight = set.e1rm;
    //     let prIndex;
    //     user.prs.forEach((pr, i) => {
    //       if (pr.movement === movement) {
    //         prIndex = i;
    //       }
    //     });
    //     user.prs.splice(prIndex, 1, pr);
    //   } else if (!pr) {
    //     pr = {
    //       movement: movement,
    //       weight: set.e1rm,
    //       date: createWorkoutDto.date,
    //     };
    //     user.prs = [...user.prs, pr];
    //   }
    // });
    await user.save((err, user) => {
      if (err) {
        throw new InternalServerErrorException(
          'workout could not be saved.',
          err,
        );
      }
    });
  }

  exportWorkout(user: Model<IUser>, exportWorkoutDto: ExportWorkoutDto) {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    // output file in the same folder
    const filename = path.join(__dirname, 'output.csv');
    const output = []; // holds all rows of data

    const headings = ['Movement', 'Weight', 'Reps', 'RPE', '\n'];

    output.push(headings);

    exportWorkoutDto.sets.forEach(d => {
      const row = []; // a new array for each row of workoutata
      row.push(d.movement);
      row.push(d.weight);
      row.push(d.reps);
      row.push(d.rpe);
      output.push(row.join() + '\n');
    });

    return output; // by default, join() uses a ','
  }

  async findOneByEmail(email): Model<IUser> {
    return await this.userModel.findOne({ email });
  }

  calculatePrs(date: Date, sets: ISet[], user: Model<IUser>) {
    sets.forEach(set => {
      let rpeArr = rpeChart[set.rpe];

      let percentage = rpeArr.filter(rpe => {
        return rpe.reps === set.reps;
      })[0];

      let e1rm = set.weight * (100 / percentage.percentage);

      set.e1rm = e1rm;

      let movement = set.movement;

      let pr = user.prs.filter(pr => {
        return pr.movement === movement;
      })[0];

      if (pr && pr.weight < set.e1rm) {
        pr.weight = set.e1rm;
        let prIndex;
        user.prs.forEach((pr, i) => {
          if (pr.movement === movement) {
            prIndex = i;
          }
        });
        user.prs.splice(prIndex, 1, pr);
      } else if (!pr) {
        pr = {
          movement: movement,
          weight: set.e1rm,
          date: date,
        };
        user.prs = [...user.prs, pr];
      }
    });
  }
}
