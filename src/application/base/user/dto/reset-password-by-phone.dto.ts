import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordByPhoneDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}