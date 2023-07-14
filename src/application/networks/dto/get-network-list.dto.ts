import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray } from 'class-validator';
import { GetNetworksDto } from './get-networks.dto';

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
