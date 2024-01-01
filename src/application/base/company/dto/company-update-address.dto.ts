import { Company } from '../../../../infrastructure/database/entities/Company';
import { IsNumber, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyUpdateAddressDto {
  @ApiProperty()
  @IsString()
  companyAddress?: string;

  @ApiProperty()
  @IsString()
  companyPostalCode?: string;

  @ApiProperty()
  @IsNumber()
  provinceId?: number;

  @ApiProperty()
  @IsNumber()
  cityId?: number;
}
