import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApplicationRefDto } from 'src/application/edge-gateway/dto/application-ref.dto';
import { NatFirewallMatchEnum } from 'src/wrappers/main-wrapper/service/user/nat/enum/nat-firewall-match.enum';

export class NatRulesListDTO {
  @ApiProperty({
    type: String,
    example: '4ffc5afd-0e3b-45db-b9c4-ec545fa5b43f',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: Boolean, required: false })
  @IsBoolean()
  logging?: boolean;

  @ApiProperty({ type: Number, required: false, example: 2 })
  @IsNumber()
  priority: number;

  @ApiProperty({
    enum: NatFirewallMatchEnum,
    required: true,
    example: 'MATCH_EXTERNAL_ADDRESS',
  })
  @IsEnum(NatFirewallMatchEnum)
  firewallMatch: NatFirewallMatchEnum;

  @ApiProperty({ type: String, example: 'test' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, example: '192.168.1.1' })
  @IsString()
  @ValidateIf((object, item) => item !== null)
  externalIp: string;

  @ApiProperty({ type: String, example: '192.168.1.1' })
  @IsString()
  @ValidateIf((object, item) => item !== null)
  internalIp: string;

  @ApiProperty({ type: String, example: '192.168.1.1' })
  @IsString()
  @IsOptional()
  @ValidateIf((object, item) => item !== null)
  destinationIp?: string;

  @ApiProperty({ type: String, example: 'DNAT' })
  @IsString()
  type: string;

  @ApiProperty({ type: ApplicationRefDto })
  applicationPortProfile?: ApplicationRefDto;

  @ApiProperty({ type: String })
  @IsString()
  @ValidateIf((object, item) => item !== null)
  description?: string;

  @ApiProperty({ type: Number, example: 22 })
  @ValidateIf((object, item) => item !== null)
  @IsNumber()
  @IsOptional()
  externalPort?: number;
}
