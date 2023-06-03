import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceItemDto {
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  itemTypeCode?: string;

  @IsNumber()
  @ApiProperty()
  serviceInstanceId: number;

  @IsNumber()
  @ApiProperty()
  itemTypeId: number;
}
