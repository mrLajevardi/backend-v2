import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EnableVerifyOtpTwoFactorAuthDto {
  @ApiProperty()
  @IsString()
  hash: string;

  @ApiProperty()
  @IsString()
  otp: string;
}
