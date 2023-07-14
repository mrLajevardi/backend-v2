import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DhcpV4BindingConfigDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  gatewayIpAddress: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  hostName: string;
}
