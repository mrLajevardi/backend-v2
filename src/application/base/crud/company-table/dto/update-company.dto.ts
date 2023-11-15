import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  companyCode: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  submittedCode: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  economyCode: string | null;
}
