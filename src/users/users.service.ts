import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, IProfile } from './user.schema';
import { Model } from 'mongoose';
import { EditProfileDto } from './dto/edit-profile.dto';

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
    // user.profile = await new this.profileModel(editProfileDto);
    // user.profile.firstName = 'Butt';

    //return await user.save();
    console.log('shmerp', user);
    return user;
  }

  async editProfile(user: Model<IUser>, editProfileDto: EditProfileDto) {
    console.log(editProfileDto);
    user.profile.firstName = editProfileDto.firstName;
    user.profile.lastName = editProfileDto.lastName;
    user.save((err, user) => {
      if (err) {
        throw new InternalServerErrorException('profile could not be saved.');
      }
    });
  }

  async findOneByEmail(email): Model<IUser> {
    return await this.userModel.findOne({ email });
  }
}
