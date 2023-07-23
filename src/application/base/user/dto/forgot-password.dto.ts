import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
}
