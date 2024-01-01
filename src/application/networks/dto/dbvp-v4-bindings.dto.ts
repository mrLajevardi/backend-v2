import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class DhcpV4BindingConfigDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @ValidateIf((object, value) => {
    return value !== null;
  })
  gatewayIpAddress: string | null;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @ValidateIf((object, value) => {
    return value !== null;
  })
  hostName: string | null;
}
