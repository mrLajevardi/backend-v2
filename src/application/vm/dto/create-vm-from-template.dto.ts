import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Network, StoragePolicy } from './create-vm.dto';

export class CreateVmFromTemplate {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  name: string;
  computerName: string;
  networks: Network[];
  powerOn: boolean;
  primaryNetworkIndex: number;
  templateId: string;
  templateName: string;
  storage: StoragePolicy;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description: string;
}
