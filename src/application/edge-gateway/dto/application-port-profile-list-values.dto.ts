import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';
import { ApplicationPortsDto } from './application-ports.dto';

export class ApplicationPortProfileListValuesDto {
  @ApiProperty({ example: 'urn:vcloud:applicationPortProfile:16364781-e858-3f0c-b598-674002381089' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'AD Server' })
  @IsString()
  name: string;

  @ApiProperty({ type: [ApplicationPortsDto] })
  @IsArray()
  applicationPortProfile: ApplicationPortsDto[];

  @ApiProperty({ example: 'SYSTEM' })
  @IsString()
  scope: string;
}