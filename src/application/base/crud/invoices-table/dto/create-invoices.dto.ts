import {
  IsInt,
  IsNumber,
  IsString,
  IsBoolean,
  IsDate,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoicesDto {
  @IsInt()
  @ApiProperty()
  @IsOptional()
  id?: number;

  @IsString()
  @ApiProperty()
  serviceTypeId?: string;

  @IsNumber()
  @ApiProperty()
  rawAmount: number;

  @IsNumber()
  @ApiProperty()
  planAmount?: number;

  @IsNumber()
  @ApiProperty({ required: false })
  planRatio?: number | null;

  @IsNumber()
  @ApiProperty()
  finalAmount: number;

  @IsString()
  @ApiProperty()
  description: string;

  @IsDate()
  @ApiProperty()
  dateTime: Date;

  @IsBoolean()
  @ApiProperty()
  payed: boolean;

  @IsBoolean()
  @ApiProperty()
  voided: boolean;

  @IsDate()
  @ApiProperty()
  endDateTime?: Date;

  @IsInt()
  @ApiProperty()
  type?: number;

  @IsString()
  @ApiProperty({ required: false })
  name?: string | null;

  @IsInt()
  @ApiProperty()
  userId: number;

  @IsString()
  @ApiProperty()
  serviceInstanceId: string;

  servicePlanType: number;
}
