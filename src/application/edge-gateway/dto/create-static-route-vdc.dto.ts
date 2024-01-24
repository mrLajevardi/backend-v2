import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsObject,
  Validate,
  isIP,
  IsIP,
} from 'class-validator';
import { instance } from 'ts-mockito';
// import isCidr from 'is-cidr';
// import cidrRegex from "cidr-regex";

export class NextHopsScope {
  @ApiProperty({
    type: String,
    example: 'default-network',
    default: 'default-network',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'urn:vcloud:network:0c276dfb-47da-4143-b169-166d7d2f8c94',
    default: 'urn:vcloud:network:0c276dfb-47da-4143-b169-166d7d2f8c94',
    description: 'network id',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
    example: 'NETWORK',
    default: 'NETWORK',
    required: true,
  })
  @IsString()
  scopeType: string;
}

export class NextHopsDto {
  @ApiProperty({
    type: String,
    example: '192.168.0.1',
    default: '192.168.0.1',
    required: true,
  })
  @IsString()
  @IsIP(4)
  ipAddress: string;

  @ApiProperty({
    type: Number,
    example: 10,
    default: 10,
    required: true,
  })
  @IsNumber()
  adminDistance: number;

  @ApiProperty({
    type: NextHopsScope,
    required: false,
  })
  @IsObject({
    each: true,
  })
  scope?: NextHopsScope;
}

export class CreateStaticRouteVdcDto {
  @ApiProperty({ example: 'test', required: true })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: '192.168.0.0/24',
    default: '192.168.0.0/24',
    required: true,
    description: 'IP/Port',
  })
  @IsString()
  @Validate((ipV4: string) => {
    //TODO must be validation ipV4
    // return cidrRegex.v4().test(ipV4);
    return true;
    // return isCidr.v4(ipV4);
  })
  networkCidr: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: Array(NextHopsDto),
    required: true,
  })
  @IsArray()
  nextHops: NextHopsDto[];
}
