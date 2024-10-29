import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<UserDocument>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw ConflictException if user already exists', async () => {
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({} as UserDocument);

      await expect(
        service.signUp({
          email: 'test@example.com',
          password: 'password',
          name: 'Test User',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should successfully sign up a new user', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');

      const mockUser: UserDocument = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        _id: 'mockUserId',
        __v: 0,

        save: jest.fn().mockResolvedValueOnce(true),
      } as unknown as UserDocument;

      jest.spyOn(userModel, 'create').mockResolvedValueOnce([mockUser]);

      const result = await service.signUp({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      });

      expect(result).toEqual({ message: 'User registered successfully' });
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
        }),
      );
    });
  });

  describe('Password Hashing', () => {
    it('should hash the password during signup', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValueOnce('hashedPassword');

      await service.signUp({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      });

      expect(hashSpy).toHaveBeenCalledWith('password', 10);
    });
  });

  describe('SignIn', () => {
    it('should successfully sign in a user with valid credentials', async () => {
      const mockUser: UserDocument = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        _id: 'mockUserId',
        __v: 0,
        save: jest.fn(),
      } as unknown as UserDocument;

      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const result = await service.signIn({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual(
        expect.objectContaining({ access_token: expect.any(String) }),
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser._id,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.signIn({ email: 'wrong@example.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser: UserDocument = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        _id: 'mockUserId',
        __v: 0,
        save: jest.fn(),
      } as unknown as UserDocument;

      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(
        service.signIn({
          email: 'test@example.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Logging', () => {
    it('should log a warning when trying to sign up with an existing email', async () => {
      const warnSpy = jest.spyOn(service['logger'], 'warn');
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValueOnce({} as UserDocument);

      await expect(
        service.signUp({
          email: 'test@example.com',
          password: 'password',
          name: 'Test User',
        }),
      ).rejects.toThrow(ConflictException);

      expect(warnSpy).toHaveBeenCalledWith(
        'SignUp attempt failed: User with email test@example.com already exists',
      );
    });

    it('should log a successful sign in', async () => {
      const logSpy = jest.spyOn(service['logger'], 'log');
      const mockUser: UserDocument = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        _id: 'mockUserId',
        __v: 0,
        save: jest.fn(),
      } as unknown as UserDocument;

      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      await service.signIn({ email: 'test@example.com', password: 'password' });

      expect(logSpy).toHaveBeenCalledWith(
        'User signed in successfully: test@example.com',
      );
    });
  });
});
