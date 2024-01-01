import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceItemsDto {
  @IsNumber()
  @ApiProperty()
  quantity?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  itemTypeCode?: string;

  @IsNumber()
  @ApiProperty()
  serviceInstanceId?: string;

  @IsNumber()
  @ApiProperty()
  itemTypeId?: number;

  @IsString()
  value?: string;
}
