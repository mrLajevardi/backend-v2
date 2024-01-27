import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VerifyOtpTwoFactorAuthDto {
  @IsOptional()
  @ApiProperty()
  @IsString()
  hash?: string;

  @ApiProperty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;
}
