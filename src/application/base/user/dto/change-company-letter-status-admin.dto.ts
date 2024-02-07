import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CompanyLetterStatusEnum } from '../enum/company-letter-status.enum';

export class ChangeCompanyLetterStatusAdminDto {
  @ApiProperty({
    type: CompanyLetterStatusEnum,
    enum: CompanyLetterStatusEnum,
    example: CompanyLetterStatusEnum.Inserted,
  })
  @IsEnum(CompanyLetterStatusEnum)
  companyLetterStatus: CompanyLetterStatusEnum;
}
