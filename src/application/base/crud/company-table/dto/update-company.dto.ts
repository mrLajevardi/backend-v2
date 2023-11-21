import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  companyName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  companyCode?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  submittedCode?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  economyCode?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  provinceId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  cityId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  companyPhoneNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  companyPostalCode?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  companyAddress?: string;
}
