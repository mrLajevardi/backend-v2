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
  States = 'static',
  Pyag = 'pyag',
}

export enum InvoiceTypes {
  Upgrade = 'upgrade',
  Create = 'create',
  Extend = 'extend',
}

export enum InvoiceNumericTypes {
  Upgrade = 2,
  Extend = 1,
  Create = 0,
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
  @ValidateIf((object) => {
    return object.type !== InvoiceTypes.Create;
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
