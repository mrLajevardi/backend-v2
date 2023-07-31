import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class PhoneNumberDto {
  @ApiProperty()
  @Matches('^(\\+98|0)?9\\d{9}$')
  phoneNumber: string;
}
