import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { DhcpPoolsDto } from 'src/application/edge-gateway/dto/dhcp-pools.dto';

export class GetDhcpDto {
  @ApiProperty({ type: Number, required: true, example: 86400 })
  @IsNumber()
  leaseTime: number;

  @ApiProperty({ type: String, required: true, example: '192.168.1.1' })
  @IsString()
  ipAddress: string;

  @ApiProperty({ type: [DhcpPoolsDto], required: true })
  @IsArray()
  dhcpPools: DhcpPoolsDto[];

  @ApiProperty({ type: [String], required: true, example: ['1.1.1.1', '8.8.8.8'] })
  @IsArray()
  @IsString({ each: true })
  dnsServers: string[];

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: String, example: 'EDGE' })
  @IsString()
  mode: string;

  @ApiProperty({ type: String, example: '192.168.1.1/24' })
  @IsString()
  subnet: string;
}
