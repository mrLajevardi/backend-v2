import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { NetworkSubnetIpRangeDto } from './network-subnet-ip-range.dto';

class Values {
  @ApiProperty({ type: [NetworkSubnetIpRangeDto] })
  values: NetworkSubnetIpRangeDto[];
}
export class NetworkSubnetsDto {
  @ApiProperty({ type: String, default: '192.168.1.1' })
  @IsString()
  gateway: string;

  @ApiProperty({ type: Number, default: 24 })
  @IsNumber()
  prefixLength: number;

  @ApiProperty({ type: String, default: 'google.com' })
  @IsString()
  dnsSuffix: string;

  @ApiProperty({ type: String, default: '1.1.1.1' })
  @IsString()
  dnsServer1: string;

  @ApiProperty({ type: String, default: '8.8.8.8' })
  @IsString()
  dnsServer2: string;

  @ApiProperty({ type: [NetworkSubnetIpRangeDto] })
  ipRanges: Values;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: Number, default: 2 })
  @IsNumber()
  totalIpCount: number;

  @ApiProperty({ type: Number, default: '1' })
  @IsString()
  usedIpCount: number;
}
