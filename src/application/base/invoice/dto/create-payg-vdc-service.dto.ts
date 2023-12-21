import { ApiProperty } from '@nestjs/swagger';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from './create-service-invoice.dto';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
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

  @ApiProperty({ type: Number })
  @IsNumber()
  @ValidateIf((object: CreateServiceInvoiceDto) => object.templateId === null)
  duration: number;

  @IsString()
  @ApiProperty({ type: String })
  @ValidateIf((object, value) => value !== null)
  templateId?: string;

  @IsString()
  @ApiProperty({ type: String })
  @ValidateIf((object, value) => value !== null)
  serviceInstanceId?: string;
}
