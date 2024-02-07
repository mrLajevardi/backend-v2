import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class ForgotPasswordVerifyOtpDto {
  @ApiProperty({
    type: String,
  })
  @Matches('^(\\+98|0)?9\\d{9}$')
  phoneNumber: string;

  @ApiProperty({
    type: String,
  })
  hash: string;

  @ApiProperty({
    type: String,
  })
  otp: string;

  @ApiProperty({
    type: String,
  })
  newPassword: string;
}
