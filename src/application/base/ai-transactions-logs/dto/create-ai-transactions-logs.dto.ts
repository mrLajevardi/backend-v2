import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAiTransactionsLogsDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  request: string;

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
  @IsDate()
  @ApiProperty()
  dateTime?: Date;
}
