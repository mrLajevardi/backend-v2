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

class BaseGenerationItem extends GenerationItem {
  @IsNumber()
  @ApiProperty({ type: Number })
  @IsOptional()
  id?: number;
}

class GenerationItemParent {
  @ApiProperty({ type: [GenerationItem] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => GenerationItem)
  @ValidateNested({ each: true })
  levels: GenerationItem[];

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  id?: number;
}
class ComputeItem extends GenerationItemParent {
  @ApiProperty({ type: Number })
  @IsNumber()
  basePrice: number;
}
class DiskItem extends GenerationItem {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  enabled: boolean;
}

class DiskItemParent {
  @ApiProperty({ type: [DiskItem] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => DiskItem)
  @ValidateNested({ each: true })
  levels: DiskItem[];

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  id?: number;
}
class GenerationItems {
  @ApiProperty({ type: ComputeItem })
  ram: ComputeItem;

  @ApiProperty({ type: ComputeItem })
  cpu: ComputeItem;

  @ApiProperty({ type: DiskItemParent })
  diskItems: DiskItemParent;

  @ApiProperty({ type: BaseGenerationItem })
  vm: BaseGenerationItem;

  @ApiProperty({ type: BaseGenerationItem })
  ip: BaseGenerationItem;
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

  @IsNumber()
  @ApiProperty({ type: Number })
  @IsOptional()
  id?: number;
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

class PeriodParent {
  @IsNumber()
  @ApiProperty({ type: Number })
  @IsOptional()
  id?: number;

  @IsArray({})
  @IsObject({ each: true })
  @Type(() => Period)
  @ValidateNested({ each: true })
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @ApiProperty({ type: [Period] })
  levels: Period[];
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

class ReservationParent {
  @IsNumber()
  @ApiProperty({ type: Number })
  @IsOptional()
  id?: number;

  @IsArray()
  @IsObject({ each: true })
  @Type(() => Reservation)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [Reservation] })
  levels: Reservation[];
}

export class CreateDatacenterDto {
  @ApiProperty({ type: String })
  @IsString()
  title: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  id?: string;

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

  @ApiProperty({ type: PeriodParent })
  period: PeriodParent;

  @ApiProperty({ type: ReservationParent })
  reservationCpu: ReservationParent;

  @ApiProperty({ type: ReservationParent })
  reservationRam: ReservationParent;
}
