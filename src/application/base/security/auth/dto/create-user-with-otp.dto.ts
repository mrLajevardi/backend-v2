import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class CreateUserWithOtpDto {
  @ApiProperty()
  @Matches('^(\\+98|0)?9\\d{9}$')
  phoneNumber: string;

  @ApiProperty()
  password?: string; 

  @ApiProperty()
  otp?: string;

  @ApiProperty()
  hash?: string;
}
