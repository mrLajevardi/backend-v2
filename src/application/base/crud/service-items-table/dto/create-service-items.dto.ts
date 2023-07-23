import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceItemsDto {
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  itemTypeCode?: string;

  @IsString()
  @ApiProperty()
  serviceInstanceId: string;

  @IsNumber()
  @ApiProperty()
  itemTypeId: number;
}
