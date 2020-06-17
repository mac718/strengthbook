import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { IUser, IProfile } from './user.schema';
import { Model } from 'mongoose';

let mockProfile = { firstName: 'Mike', lastName: 'Thing', bodyWeight: 75 };
let mockUser = { email: 'Mike', password: 'thing', profile: mockProfile };

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
          useValue: { create: jest.fn().mockResolvedValue(mockUser) },
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
      userModel.create = jest.fn().mockResolvedValue(mockUser);
      let spy = jest.spyOn(userModel, 'create');
      const user = await service.createUser(mockUser, mockProfile);

      expect(spy).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });
  });
});
