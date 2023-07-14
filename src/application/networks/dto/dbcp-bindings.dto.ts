import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DhcpV4BindingConfigDto } from './dbvp-v4-bindings.dto';

export class DhcpBindingsDataDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  id: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  description: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  ipAddress: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  macAddress: string;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  leaseTime: number;

  @ApiProperty({ type: [String], required: true })
  @IsArray()
  @IsString({ each: true })
  dnsServers: string[];

  @ApiProperty({ type: DhcpV4BindingConfigDto, required: true })
  @ValidateNested()
  @Type(() => DhcpV4BindingConfigDto)
  dhcpV4BindingConfig: DhcpV4BindingConfigDto;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  version: number;
}
