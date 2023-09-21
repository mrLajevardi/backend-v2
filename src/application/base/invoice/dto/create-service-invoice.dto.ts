import {
  IsNumber,
  IsString,
  IsArray,
  Matches,
  ValidateIf,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ServicePlanTypes {
  STATIC = 'static',
  PAYG = 'pyag',
}

export enum InvoiceTypes {
  UPDATE = 'update',
  Create = 'create',
  EXTEND = 'extend',
}
export class InvoiceItemsDto {
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 22,
  })
  itemTypeId: number;

  @IsString()
  @ApiProperty({
    type: String,
  })
  value: string;
}

export class CreateServiceInvoiceDto {
  @IsEnum(InvoiceTypes)
  @ApiProperty({
    type: String,
    example: 'create',
    enum: InvoiceTypes,
  })
  type: InvoiceTypes;

  @ApiProperty({
    type: [InvoiceItemsDto],
  })
  @IsArray()
  @Type(() => InvoiceItemsDto)
  @ValidateNested({ each: true })
  itemsTypes: InvoiceItemsDto[];

  @IsString()
  @Matches(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  )
  @ValidateIf((object, value) => {
    return value !== null;
  })
  @ApiProperty()
  serviceInstanceId: string;

  @ApiProperty({
    type: ServicePlanTypes,
    enum: ServicePlanTypes,
  })
  @IsEnum(ServicePlanTypes)
  servicePlanTypes: ServicePlanTypes;
}
