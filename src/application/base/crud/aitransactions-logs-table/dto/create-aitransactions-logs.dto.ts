import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAITransactionsLogsDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  request: string;

  @IsOptional()
  itemTypeId?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  body: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  response: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  method: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  codeStatus: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  methodName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  ip: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  dateTime?: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;

  @IsOptional()
  serviceInstanceId: string;
}
