import { IsString, IsEmail } from 'class-validator';

export class ResendEmailDto {
  @IsString()
  @IsEmail()
  email: string;
}