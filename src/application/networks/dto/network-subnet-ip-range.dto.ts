import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NetworkSubnetIpRangeDto {
  @ApiProperty({ type: String, default: '192.168.1.2' })
  @IsString()
  startAddress: string;

  @ApiProperty({ type: String, default: '192.168.1.4' })
  @IsString()
  endAddress: string;
}
