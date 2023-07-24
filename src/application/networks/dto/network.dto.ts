import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches } from 'class-validator';

export class IPRangeDto {
  @ApiProperty({ type: String })
  @IsString()
  @Matches(
    /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  )
  startAddress: string;

  @ApiProperty({ type: String })
  @IsString()
  @Matches(
    /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  )
  endAddress: string;
}
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

  @ApiProperty({ type: [IPRangeDto] })
  ipRanges: IPRangeDto[];

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

  @ApiProperty()
  @IsString()
  name: string;
}
