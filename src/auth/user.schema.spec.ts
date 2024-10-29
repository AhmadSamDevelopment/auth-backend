import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

describe('User Schema', () => {
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should create a new user', async () => {
    const mockUser: UserDocument = {
      _id: new mongoose.Types.ObjectId(),
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword',
      validate: jest.fn().mockResolvedValue(undefined),
      __v: 0,
    } as unknown as UserDocument;

    jest.spyOn(userModel, 'create').mockResolvedValue(mockUser as any);

    const user = await userModel.create({
      email: 'test@example.com',
      password: 'hashedPassword',
    });
    expect(user).toEqual(mockUser);
  });
});
