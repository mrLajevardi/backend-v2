import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { ServicePlanTypeEnum } from 'src/application/base/service/enum/service-plan-type.enum';

export class TemplateItem {
  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({ type: String })
  unit: string;

  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String, nullable: true })
  value: string | null;

  @ApiProperty({ type: String })
  title: string;
}
export class TemplateGenerationItemsDto {
  @ApiProperty({ type: TemplateItem })
  vm: TemplateItem;

  @ApiProperty({ type: TemplateItem })
  ram: TemplateItem;

  @ApiProperty({ type: [TemplateItem] })
  disk: TemplateItem[];

  @ApiProperty({ type: TemplateItem })
  cpu: TemplateItem;

  @ApiProperty({ type: TemplateItem })
  ip: TemplateItem;
}
export class TemplateItemsDto {
  @ApiProperty({ type: TemplateGenerationItemsDto })
  generation: TemplateGenerationItemsDto;

  @ApiProperty({ type: TemplateItem })
  reservationRam: TemplateItem;

  @ApiProperty({ type: TemplateItem })
  reservationCpu: TemplateItem;

  @ApiProperty({ type: TemplateItem })
  guaranty: TemplateItem;

  @ApiProperty({ type: TemplateItem })
  period: TemplateItem;
}

export class TemplateDatacenter {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  title: string;
}

export class TemplatesStructure {
  @ApiProperty({ type: TemplateItemsDto })
  items: TemplateItemsDto;

  @ApiProperty({ type: String })
  generation: string;

  @ApiProperty({ type: Number })
  rawPrice: number;

  @ApiProperty({ type: Number })
  finalPrice: number;

  @ApiProperty({ type: TemplateDatacenter })
  datacenter: TemplateDatacenter;
}
export class TemplatesDto extends TemplatesStructure {
  @ApiProperty({ type: String })
  guid: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: ServicePlanTypeEnum, enum: ServicePlanTypeEnum })
  servicePlanType: ServicePlanTypeEnum;

  @ApiProperty({ type: Boolean })
  isDefault: boolean;
}

export class templatesQueryParamsDto {
  @ApiProperty({ type: ServicePlanTypeEnum, enum: ServicePlanTypeEnum })
  @Transform((item) => Number(item.value))
  @IsEnum(ServicePlanTypeEnum)
  servicePlanType: ServicePlanTypeEnum;

  // @ApiProperty({ type: String })
  // @IsString()
  // datacenterName: string;
}
