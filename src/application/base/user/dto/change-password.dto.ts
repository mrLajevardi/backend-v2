import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangePasswordDto {
  @ApiProperty()
  @IsOptional()
  oldPassword?: string;

  @ApiProperty()
  @IsString()
  @Matches('^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$')
  newPassword: string;

  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty({ default: false })
  otpVerification: boolean;
}
