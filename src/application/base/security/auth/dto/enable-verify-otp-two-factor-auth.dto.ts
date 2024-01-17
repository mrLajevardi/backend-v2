import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EnableVerifyOtpTwoFactorAuthDto {
  @IsOptional()
  @ApiProperty()
  @IsString()
  hash?: string;

  @ApiProperty()
  @IsString()
  otp: string;
}
