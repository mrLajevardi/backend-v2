import { ApiProperty } from '@nestjs/swagger';
import { InvoiceItemsDto } from './create-service-invoice.dto';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';

export class InvoiceCalculatorResultDto {
  @ApiProperty({ type: Number })
  cost: number;
}

export class InvoiceCalculatorDto {
  @ApiProperty({
    type: [InvoiceItemsDto],
  })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => InvoiceItemsDto)
  @ValidateNested({ each: true })
  itemsTypes: InvoiceItemsDto[];

  @ApiProperty({
    type: ServicePlanTypeEnum,
    enum: ServicePlanTypeEnum,
  })
  @IsEnum(ServicePlanTypeEnum)
  servicePlanTypes: ServicePlanTypeEnum;

  @IsOptional()
  @ApiProperty({
    type: ServiceTypesEnum,
    enum: ServiceTypesEnum,
  })
  @IsEnum(ServiceTypesEnum)
  serviceType: ServiceTypesEnum = ServiceTypesEnum.Vdc;
}
