import { IsEmail, IsNotEmpty, MaxLength, Min, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MinLength(4)
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  password: string;
}