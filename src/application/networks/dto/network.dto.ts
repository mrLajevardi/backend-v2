import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
export class NetworkDto {
  @ApiProperty({ type: String })
  @IsString()
  dnsServer1: string;

  @ApiProperty({ type: String })
  @IsString()
  dnsServer2: string;

  @ApiProperty({ type: String })
  @IsString()
  dnsSuffix?: string;

  @ApiProperty({ type: String })
  @IsString()
  ipRanges: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: String })
  @IsString()
  gateway: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  prefixLength: number;

  @ApiProperty({ type: String })
  @IsString()
  networkType: string;
}
