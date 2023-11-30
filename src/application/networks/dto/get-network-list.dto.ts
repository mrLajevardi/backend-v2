import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsArray,
  Min,
  Max,
  IsString,
  IsOptional,
} from 'class-validator';
import { GetNetworksDto } from './get-networks.dto';
import { Transform } from 'class-transformer';

export class GetNetworkListDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  page: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  pageCount: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  pageSize: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  resultTotal: number;

  @ApiProperty({ type: [GetNetworksDto] })
  @IsArray()
  values: GetNetworksDto[];
}

export class GetNetworkListQueryDto {
  @ApiProperty({ type: Number })
  @Transform((item) => Number(item.value))
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({ type: Number })
  @Transform((item) => Number(item.value))
  @IsNumber()
  @Min(1)
  @Max(128)
  pageSize: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  filter?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
