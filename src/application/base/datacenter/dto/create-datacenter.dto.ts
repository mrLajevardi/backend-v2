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
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';

export class GenerationItem {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @Expose()
  code: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Expose()
  min: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Expose()
  max: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Expose()
  step: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  @Expose()
  percent?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  @Expose()
  price?: number;
}
export class ComputeItem {
  @ApiProperty({ type: Number })
  @IsNumber()
  @Expose()
  basePrice: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Expose()
  baseMax: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Expose()
  baseMin: number;

  @ApiProperty({ type: [GenerationItem] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => GenerationItem)
  @ValidateNested({ each: true })
  @Expose()
  levels: GenerationItem[];
}
export class DiskItem extends GenerationItem {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @Expose()
  enabled: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @Expose()
  isHidden: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Expose()
  price: number;

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  title: string;

  @ApiProperty({ type: Number })
  @IsString()
  @Expose()
  iops: number;
}
export class GenerationItems {
  @ApiProperty({ type: ComputeItem })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ComputeItem)
  @Expose()
  ram: ComputeItem;

  @ApiProperty({ type: ComputeItem })
  @ApiProperty({ type: ComputeItem })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Expose()
  @Type(() => ComputeItem)
  cpu: ComputeItem;

  @ApiProperty({ type: [DiskItem] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => DiskItem)
  @Expose()
  @ValidateNested({ each: true })
  diskItems: DiskItem[];

  @ApiProperty({ type: GenerationItem })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Expose()
  @Type(() => GenerationItem)
  vm: GenerationItem;

  @ApiProperty({ type: GenerationItem })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => GenerationItem)
  @Expose()
  ip: GenerationItem;
}

export class Generation {
  @ApiProperty({ type: GenerationItems })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => GenerationItems)
  @Expose()
  items: GenerationItems;

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  providerId: string;

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({
    enum: ServicePlanTypeEnum,
    type: ServicePlanTypeEnum,
  })
  @IsEnum(ServicePlanTypeEnum)
  @Expose()
  type: ServicePlanTypeEnum;
}

export class Period {
  @IsNumber()
  @Expose()
  @ApiProperty({ type: Number })
  percent: number;

  @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 36, 48, 60])
  @IsNumber()
  @Expose()
  @ApiProperty({ type: Number })
  value: number;

  @IsString()
  @ApiProperty({ type: String })
  @Expose()
  title: string;
}

export class Reservation {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @Expose()
  enabled: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Expose()
  value: number;

  @IsNumber()
  @ApiProperty({ type: Number })
  @Expose()
  percent: number;

  @ApiProperty({
    enum: ServicePlanTypeEnum,
    type: ServicePlanTypeEnum,
  })
  @Expose()
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
  paygGenerations: Generation[];

  @IsArray()
  @IsObject({ each: true })
  @Type(() => Generation)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [Generation] })
  staticGenerations: Generation[];

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  enabled: boolean;

  @IsArray({})
  @IsObject({ each: true })
  @Type(() => Period)
  @ValidateNested({ each: true })
  // @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @ApiProperty({ type: [Period] })
  period: Period[];

  @IsArray()
  @IsObject({ each: true })
  @Type(() => Reservation)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [Reservation] })
  paygReservationCpu: Reservation[];

  @IsArray()
  @IsObject({ each: true })
  @Type(() => Reservation)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [Reservation] })
  staticReservationCpu: Reservation[];

  @IsArray()
  @IsObject({ each: true })
  @Type(() => Reservation)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [Reservation] })
  paygReservationRam: Reservation[];

  @IsArray()
  @IsObject({ each: true })
  @Type(() => Reservation)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [Reservation] })
  staticReservationRam: Reservation[];
}
