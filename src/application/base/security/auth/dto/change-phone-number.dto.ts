import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class ChangePhoneNumberDto {
  @ApiProperty()
  @IsOptional()
  @Matches('^(\\+98|0)?9\\d{9}$')
  oldPhoneNumber?: string;

  @ApiProperty()
  @IsOptional()
  @Matches('^(\\+98|0)?9\\d{9}$')
  newPhoneNumber?: string;

  @ApiProperty()
  @IsOptional()
  hash: string;

  @ApiProperty()
  @IsOptional()
  otp: string;
}
