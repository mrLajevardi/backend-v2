import { ApiProperty } from '@nestjs/swagger';
import { InvoiceItemsDto } from './create-service-invoice.dto';
import { IsArray, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';

export class VdcInvoiceCalculatorResultDto {
  @ApiProperty({ type: Number })
  cost: number;
}

export class VdcInvoiceCalculatorDto {
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
}
