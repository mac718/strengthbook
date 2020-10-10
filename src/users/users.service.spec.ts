import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { IUser, IProfile } from './user.schema';
import { Model } from 'mongoose';
import { async } from 'rxjs/internal/scheduler/async';
import { EditProfileDto } from './dto/edit-profile.dto';
import { UsersController } from './users.controller';

let mockProfile: Model<IProfile> = {
  firstName: 'Mike',
  lastName: 'Coon',
  bodyweight: 75,
  dob: new Date('1980-10-21'),
};
let mockUser: Model<IUser> = {
  firstName: 'Mike',
  lastName: 'Coon',
  email: 'mac718@gmail.com',
  password: 'thing',
  profile: mockProfile,
  workouts: [],
  prs: [],
};

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<IUser>;
  let profileModel: Model<IProfile>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: getModelToken('Profile'),
          useValue: { create: jest.fn().mockResolvedValue(mockProfile) },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<IUser>>(getModelToken('User'));
    profileModel = module.get<Model<IProfile>>(getModelToken('Profile'));
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      let spy = jest.spyOn(userModel, 'create');
      const user = await service.createUser(mockUser, mockProfile);

      expect(spy).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });
  });

  describe('editProfile', () => {
    it('should edit user profile attributes', async () => {
      const user = await service.createUser(mockUser, mockProfile);
      //console.log('test', user);
      //let user = await userModel.new();
      jest.spyOn(userModel, 'save').mockResolvedValue(true);
      console.log('test', user);
      expect(user.profile.firstName).toBe('Mike');
      expect(user.profile.lastName).toBe('Coon');
      expect(user.profile.bodyweight).toBe(75);
      expect(user.profile.dob).toEqual(new Date('1980-10-21'));

      let mockProfileDto = {
        firstName: 'John',
        lastName: 'Guy',
        bodyweight: 300,
        dob: new Date('1980-10-22'),
      };

      await service.editProfile(user, mockProfileDto);
      expect(user.profile.firstName).toEqual('John');
    });
  });
});
