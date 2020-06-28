import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

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

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  profile: IProfile;
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
