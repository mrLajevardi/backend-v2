import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';

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

  @IsOptional()
  serviceInstance: ServiceInstances;

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
