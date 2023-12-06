import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpTwoFactorAuthDto {
  @ApiProperty()
  hash: string;

  @ApiProperty()
  otp: string;
}
