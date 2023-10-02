import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class GenerateSourceTokenDto {
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  clientSecret: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  oldPassword: string;
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class TokenRequestDto {
  @IsNotEmpty()
  code: string;
}

export class UpdateProfileDto {
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
