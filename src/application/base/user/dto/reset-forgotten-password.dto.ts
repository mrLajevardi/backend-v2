import { IsString, MinLength } from 'class-validator';

export class ResetForgottenPasswordDto {
  @IsString()
  @MinLength(8)
  newPassword: string;
}