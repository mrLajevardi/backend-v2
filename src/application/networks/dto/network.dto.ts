import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { NetworksTypesEnum } from 'src/wrappers/main-wrapper/service/user/network/enum/network-types.enum';

export class IPRangeDto {
  @ApiProperty({ type: String })
  @IsString()
  @Matches(
    /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  )
  startAddress: string;

  @ApiProperty({ type: String })
  @IsString()
  @Matches(
    /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  )
  endAddress: string;
}
export class NetworkDto {
  @ApiProperty({ type: String })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  dnsServer1: string | null;

  @ApiProperty({ type: String })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  dnsServer2: string | null;

  @ApiProperty({ type: String })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  dnsSuffix: string | null;

  @ApiProperty({ type: String })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  description: string | null;

  @ApiProperty({ type: String })
  @IsString()
  gateway: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  prefixLength: number;

  @ApiProperty({ type: NetworksTypesEnum, enum: NetworksTypesEnum })
  @IsEnum(NetworksTypesEnum)
  networkType: NetworksTypesEnum;

  @ApiProperty()
  @IsString()
  name: string;
}
