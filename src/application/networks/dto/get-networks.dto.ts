import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';
import { NetworkSubnetsDto } from './network-subnets.dto';
import { NetworkStatusEnum } from 'src/wrappers/main-wrapper/service/user/network/enum/network-status.enum';

class Values {
  @ApiProperty({ type: [NetworkSubnetsDto] })
  values: NetworkSubnetsDto[];
}
export class GetNetworksDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: [NetworkSubnetsDto] })
  @IsArray()
  subnets: Values;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  networkType: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: NetworkStatusEnum, enum: NetworkStatusEnum })
  status: NetworkStatusEnum;

  // backingNetworkId: string;

  // backingNetworkType: string;

  // parentNetworkId: string;

  // orgVdc: Ref;

  // ownerRef: Ref;

  // orgVdcIsNsxTBacked: null;

  // orgRef: Ref;
}
