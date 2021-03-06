import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const ProfileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: Date,
  sex: String,
  bodyweight: Number,
  unit: String,
  trackedMovements: [String],
});

export interface IProfile extends mongoose.Document {
  firstName: string;
  lastName: string;
  dob: Date;
  // sex: string;
  bodyweight: number;
  // unit: string;
  trackedMovements: string[];
}

export const SetSchema = new mongoose.Schema({
  movement: String,
  exerciseOrder: Number,
  setOrder: Number,
  weight: Number,
  reps: Number,
  rpe: Number,
  rir: Number,
  e1rm: Number,
});

export interface ISet extends mongoose.Document {
  movement: string;
  exerciseOrder: number;
  setOrder: number;
  weight: number;
  reps: number;
  rpe: number;
  rir: number;
  e1rm: number;
  id: string;
}

export const PrSchema = new mongoose.Schema({
  movement: String,
  weight: Number,
  workoutId: String,
  set: SetSchema,
  date: Date,
  workout: String,
});

export interface IPr extends mongoose.Document {
  movement: string;
  weight: number;
  set: ISet;
  date: Date;
  workout: string;
}

export const WorkoutSchema = new mongoose.Schema({
  date: Date,
  sets: [SetSchema],
});

export interface IWorkout extends mongoose.Document {
  date: Date;
  sets: ISet[];
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

export interface IUser extends mongoose.Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profile: IProfile;
  workouts: Array<IWorkout>;
  prs: Array<IPr>;
}

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
