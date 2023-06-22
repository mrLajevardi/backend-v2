import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  ratio: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isBuiltIn: boolean;

  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false })
  validDate?: Date;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  code?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  serviceTypeId: number;
}
