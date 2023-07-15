import {
  IsInt,
  IsNumber,
  IsString,
  IsBoolean,
  IsDate,
  IsOptional,
  IsArray,
  Min,
  Max,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class InvoiceItemsDto {
  @IsString()
  @ApiProperty()
  itemCode: string;

  @IsNumber()
  @ApiProperty()
  quantity: number;
}

export class CreateServiceInvoiceDto {
  @IsArray()
  @IsString({
    each: true,
  })
  @ApiProperty()
  plans: string[];

  @IsNumber()
  @Min(0)
  @Max(2)
  @ApiProperty()
  type: number;

  @IsString()
  @ApiProperty()
  serviceTypeId: string;

  @IsNumber()
  @ApiProperty()
  @Min(1)
  duration: number;

  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsArray()
  items: InvoiceItemsDto[];

  @IsString()
  @Matches(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  )
  @ValidateIf((object, value) => {
    return value !== null;
  })
  @ApiProperty()
  serviceInstanceId: string;
}
