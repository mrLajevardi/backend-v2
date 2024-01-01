import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { InvoiceTypes } from 'src/application/base/invoice/enum/invoice-type.enum';
import { ServicePlanTypeEnum } from 'src/application/base/service/enum/service-plan-type.enum';

export class UpdateTemplatesDto {
  @ApiProperty({ type: Date })
  @IsDate()
  lastEditDate: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  creatorId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  lastEditorId: number;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  @ValidateIf((object: UpdateTemplatesDto, value) => value !== null)
  description: string | null;

  @ApiProperty({ type: String })
  @IsString()
  structure: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  @ValidateIf((object: UpdateTemplatesDto, value) => value !== null)
  datacenterName: string | null;

  @ApiProperty({ type: InvoiceTypes, enum: InvoiceTypes })
  @IsEnum(InvoiceTypes)
  servicePlanType: ServicePlanTypeEnum;

  @ApiProperty({ type: Date })
  expireDate: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isDefault: boolean;
}
