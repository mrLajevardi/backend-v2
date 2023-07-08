import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApplicationRefDto } from 'src/application/edge-gateway/dto/application-ref.dto';

export class NatRulesListDTO {
  @ApiProperty({ type: String, example: '4ffc5afd-0e3b-45db-b9c4-ec545fa5b43f' })
  @IsString()
  id: string;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: Boolean, required: false })
  @IsBoolean()
  logging?: boolean;

  @ApiProperty({ type: Number, required: false, example: 2 })
  @IsNumber()
  priority?: number;

  @ApiProperty({ type: String, required: true, example: 'MATCH_EXTERNAL_ADDRESS' })
  @IsString()
  firewallMatch: string;

  @ApiProperty({ type: String, example: 'test' })
  @IsString()
  name?: string;

  @ApiProperty({ type: String, example: '192.168.1.1' })
  @IsString()
  externalIP?: string;

  @ApiProperty({ type: String, example: '192.168.1.1' })
  @IsString()
  internalIP?: string;

  @ApiProperty({ type: String, example: '192.168.1.1' })
  @IsString()
  destinationIp?: string;

  @ApiProperty({ type: String, example: 'DNAT' })
  @IsString()
  type?: string;

  @ApiProperty({ type: ApplicationRefDto })
  applicationPortProfile?: ApplicationRefDto;

  @ApiProperty({ type: String })
  @IsString()
  description?: string;

  @ApiProperty({ type: Number, example: 22 })
  @IsNumber()
  externalPort?: number;
}
