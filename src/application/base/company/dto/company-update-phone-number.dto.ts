import { Company } from '../../../../infrastructure/database/entities/Company';
import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyUpdatePhoneNumberDto {
  @ApiProperty()
  @IsString()
  @Matches('^\\d{3}-\\d{8}$')
  phoneNumber: string;
}
