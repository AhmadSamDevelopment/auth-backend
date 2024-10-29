import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/src/auth/dto/signup.dto';
import { SignInDto } from './dto/src/auth/dto/signin.dto';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.userModel.findOne({
      email: signUpDto.email,
    });
    if (existingUser) {
      this.logger.warn(
        `SignUp attempt failed: User with email ${signUpDto.email} already exists`,
      );
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const user = await this.userModel.create({
      ...signUpDto,
      password: hashedPassword,
    });

    this.logger.log(`User registered successfully: ${signUpDto.email}`);
    return { message: 'User registered successfully' };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userModel.findOne({ email: signInDto.email });
    if (!user) {
      this.logger.warn(
        `SignIn attempt failed: User with email ${signInDto.email} not found`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      this.logger.warn(
        `SignIn attempt failed: Invalid password for user ${signInDto.email}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);
    this.logger.log(`User signed in successfully: ${signInDto.email}`);
    return { access_token: token };
  }
}
