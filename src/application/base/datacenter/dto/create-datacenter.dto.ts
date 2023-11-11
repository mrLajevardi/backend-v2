import { ApiProperty } from '@nestjs/swagger';
import {} from '../../itemType/enum/item-type-codes.enum';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';

class GenerationItem {
  @ApiProperty({
    type: String,
  })
  @IsString()
  code: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  min: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  max: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  step: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  percent?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  price?: number;
}

class ComputeItem {
  @ApiProperty({ type: Number })
  @IsNumber()
  basePrice: number;

  @ApiProperty({ type: [GenerationItem] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => GenerationItem)
  @ValidateNested({ each: true })
  levels: GenerationItem[];
}
class DiskItem extends GenerationItem {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  enabled: boolean;
}
class GenerationItems {
  @ApiProperty({ type: ComputeItem })
  ram: ComputeItem;

  @ApiProperty({ type: ComputeItem })
  cpu: ComputeItem;

  @IsArray()
  @IsObject({ each: true })
  @Type(() => DiskItem)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [DiskItem] })
  diskItems: DiskItem[];

  @IsArray()
  @IsObject({ each: true })
  @Type(() => GenerationItem)
  @ValidateNested({ each: true })
  @ApiProperty({ type: GenerationItem })
  vm: GenerationItem;

  @IsArray()
  @IsObject({ each: true })
  @Type(() => GenerationItem)
  @ValidateNested({ each: true })
  @ApiProperty({ type: GenerationItem })
  ip: GenerationItem;
}

class Generation {
  @ApiProperty({ type: GenerationItems })
  items: GenerationItems;

  @ApiProperty({ type: String })
  @IsString()
  providerId: string;

  @ApiProperty({
    enum: ServicePlanTypeEnum,
    type: ServicePlanTypeEnum,
  })
  @IsEnum(ServicePlanTypeEnum)
  type: ServicePlanTypeEnum;
}

class Period {
  @IsNumber()
  @ApiProperty({ type: Number })
  percent: number;

  @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 36, 48, 60])
  @IsNumber()
  @ApiProperty({ type: Number })
  value: number;

  @IsString()
  @ApiProperty({ type: String })
  title: string;
}

class Reservation {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  value: number;

  @IsNumber()
  @ApiProperty({ type: Number })
  percent: number;

  @ApiProperty({
    enum: ServicePlanTypeEnum,
    type: ServicePlanTypeEnum,
  })
  @IsEnum(ServicePlanTypeEnum)
  type: ServicePlanTypeEnum;
}

export class CreateDatacenterDto {
  @ApiProperty({ type: String })
  @IsString()
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  location: string;

  @IsArray()
  @IsObject({ each: true })
  @Type(() => Generation)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [Generation] })
  generations: Generation[];

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  enabled: boolean;

  @IsArray({})
  @IsObject({ each: true })
  @Type(() => Period)
  @ValidateNested({ each: true })
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @ApiProperty({ type: [Period] })
  period: Period[];

  @IsArray()
  @IsObject({ each: true })
  @Type(() => Reservation)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [Reservation] })
  reservationCpu: Reservation[];

  @IsArray()
  @IsObject({ each: true })
  @Type(() => Reservation)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [Reservation] })
  reservationRam: Reservation[];
}
