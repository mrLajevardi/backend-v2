import { ApiProperty } from '@nestjs/swagger';
import {} from '../../itemType/enum/item-type-codes.enum';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsIn,
  IsNotEmptyObject,
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

export class GenerationItem {
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

  @ApiProperty({ type: Number })
  @IsNumber()
  baseMax: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  baseMin: number;

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
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ComputeItem)
  ram: ComputeItem;

  @ApiProperty({ type: ComputeItem })
  @ApiProperty({ type: ComputeItem })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ComputeItem)
  cpu: ComputeItem;

  @ApiProperty({ type: [DiskItem] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => DiskItem)
  @ValidateNested({ each: true })
  diskItems: DiskItem[];

  @ApiProperty({ type: GenerationItem })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => GenerationItem)
  vm: GenerationItem;

  @ApiProperty({ type: GenerationItem })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => GenerationItem)
  ip: GenerationItem;
}

class Generation {
  @ApiProperty({ type: GenerationItems })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => GenerationItems)
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

export class Period {
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

export class Reservation {
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
