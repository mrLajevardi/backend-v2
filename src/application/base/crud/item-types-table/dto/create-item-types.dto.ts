import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceTypes } from 'src/infrastructure/database/entities/ServiceTypes';

export class CreateItemTypesDto {
  @IsInt()
  @ApiProperty()
  @IsOptional()
  id?: number;

  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  unit: string;

  @IsNumber()
  @ApiProperty()
  fee: number;

  @IsInt()
  @ApiProperty()
  maxAvailable: number;

  @IsString()
  @ApiProperty()
  code: string;

  @IsInt()
  @ApiProperty({ required: false })
  maxPerRequest: number | null;

  @IsInt()
  @ApiProperty({ required: false })
  minPerRequest: number | null;

  @IsString()
  datacenterName?: string;

  @IsString()
  rule: string;

  @IsNumber()
  parentId: number;

  @IsNumber()
  percent: number;

  @IsBoolean()
  required: boolean;

  @IsBoolean()
  enabled: boolean;

  @IsString()
  serviceTypeId?: string;

  @IsNumber()
  step: number;

  serviceType?: Partial<ServiceTypes>;

  createDate?: Date;
}
