import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';
import { NetworkSubnetsDto } from './network-subnets.dto';

export class GetNetworksDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: [NetworkSubnetsDto] })
  @IsArray()
  subnets: NetworkSubnetsDto[];

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  networkType: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  description: string;
}
