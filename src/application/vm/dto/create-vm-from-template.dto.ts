import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

type Network = {
  allocationMode: string;
  ipAddress: string;
  isConnected: boolean;
  networkAdaptorType: string;
  networkName: string;
};

export class CreateVmFromTemplate {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  name: string;
  computerName: string;
  networks: Network[];
  powerOn: boolean;
  primaryNetwork: number;
  templateId: string;
  templateName: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description: string;
}
