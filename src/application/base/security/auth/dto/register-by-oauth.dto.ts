import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterByOauthDto {
  @ApiProperty()
  @IsString()
  emailToken: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  otpCode: string;

  @ApiProperty()
  @IsString()
  otpHash: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;

  @ApiProperty()
  @IsBoolean()
  acceptTermsOfService: boolean;
}
