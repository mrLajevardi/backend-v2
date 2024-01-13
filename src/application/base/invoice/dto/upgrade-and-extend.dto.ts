import { ApiProperty } from '@nestjs/swagger';
import { InvoiceItemsDto } from './create-service-invoice.dto';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';

export class UpgradeAndExtendDto {
  @ApiProperty({
    type: [InvoiceItemsDto],
  })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => InvoiceItemsDto)
  @ValidateNested({ each: true })
  itemsTypes: InvoiceItemsDto[];

  @IsString()
  @Matches(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  )
  @ApiProperty()
  serviceInstanceId: string;

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
