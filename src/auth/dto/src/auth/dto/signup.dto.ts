import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(8)
  @Matches(/.*\d.*/, { message: 'Password must contain at least one number' })
  @Matches(/.*[a-zA-Z].*/, {
    message: 'Password must contain at least one letter',
  })
  @Matches(/.*[!@#$%^&*(),.?":{}|<>].*/, {
    message: 'Password must contain at least one special character',
  })
  password: string;
}
