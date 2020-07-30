import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Schema, MongooseModule } from '@nestjs/mongoose';

export const ProfileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: Date,
  sex: String,
  bodyweight: Number,
  unit: String,
});

export interface IProfile extends mongoose.Document {
  firstName: string;
  lastName: string;
  dob: Date;
  sex: string;
  bodyweigt: number;
  unit: string;
}

export const SetSchema = new mongoose.Schema({
  movement: String,
  exerciseOrder: Number,
  setOrder: Number,
  weight: Number,
  reps: Number,
  rpe: Number,
  e1rm: Number,
});

export const PrSchema = new mongoose.Schema({
  movement: String,
  weight: Number,
  date: Date,
});

export const WorkoutSchema = new mongoose.Schema({
  date: Date,
  sets: [SetSchema],
});

export interface ISet extends mongoose.Document {
  movement: string;
  exerciseOrder: number;
  setOrder: number;
  weight: number;
  reps: number;
  rpe: number;
  e1rm: number;
}

export interface IPr extends mongoose.Document {
  movement: string;
  weight: number;
}

export interface IWorkout extends mongoose.Document {
  date: Date;
  sets: ISet[];
}

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  profile: IProfile;
  workouts: Array<IWorkout>;
  prs: Array<IPr>;
}

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  profile: ProfileSchema,
  workouts: [WorkoutSchema],
  prs: [PrSchema],
});

UserSchema.pre('save', function(next) {
  let user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.checkPassword = function(attempt, callback) {
  let user = this;

  bcrypt.compare(attempt, user.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};
