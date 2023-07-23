import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordByPhoneDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;
}