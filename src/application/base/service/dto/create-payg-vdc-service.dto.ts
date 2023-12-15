import { ApiProperty } from '@nestjs/swagger';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../../invoice/dto/create-service-invoice.dto';
import { IsArray, IsObject, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaygVdcServiceDto {
  @ApiProperty({
    type: [InvoiceItemsDto],
  })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => InvoiceItemsDto)
  @ValidateNested({ each: true })
  @ValidateIf((object: CreateServiceInvoiceDto) => object.templateId === null)
  itemsTypes: InvoiceItemsDto[];
}
