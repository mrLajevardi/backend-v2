import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import { Optional } from '@nestjs/common';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
// import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';

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
  itemType: ItemTypes;

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
