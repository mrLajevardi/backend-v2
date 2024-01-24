import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StaticRouteNextHopeScopeResultType {
  @ApiResponseProperty({
    type: String,
    example: 'default-network',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'urn:vcloud:network:0c276dfb-47da-4143-b169-166d7d2f8c94',
  })
  id: string;

  @ApiResponseProperty({
    type: String,
    example: 'NETWORK',
  })
  scopeType: string;
}
export class StaticRouteNextHopeResultType {
  @ApiResponseProperty({
    type: String,
    example: '192.168.0.0',
  })
  ipAddress: string;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  adminDistance: number;

  @ApiResponseProperty({
    type: StaticRouteNextHopeScopeResultType,
  })
  scope?: StaticRouteNextHopeScopeResultType;
}
export class StaticRouteResultType {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  name: string;

  @ApiResponseProperty({
    type: String,
  })
  description: string;

  @ApiResponseProperty({
    type: String,
    example: '192.168.0.0/25',
  })
  networkCidr: string;

  @ApiResponseProperty({
    type: String,
    example: '192.168.0.0',
  })
  networkCidrIp: string;

  @ApiResponseProperty({
    type: String,
    example: '25',
  })
  networkCidrPort: string;

  @ApiResponseProperty({
    type: Array(StaticRouteNextHopeResultType),
  })
  nextHops: StaticRouteNextHopeResultType[];
}
export class StaticRouteResultDto extends BaseResultDto {
  collection(items: any[]): StaticRouteResultType[] {
    return items.map((item) => {
      return this.toArray(item);
    });
  }

  toArray(item: any): StaticRouteResultType {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      networkCidr: item.networkCidr,
      networkCidrIp: item.networkCidr?.split('/')[0],
      networkCidrPort: item.networkCidr?.split('/')[1],
      nextHops: this.nextHopeToArray(item.nextHops),
    };
  }

  nextHopeToArray(items: any[]): StaticRouteNextHopeResultType[] {
    return items.map((item: any): StaticRouteNextHopeResultType => {
      return {
        ipAddress: item.ipAddress,
        adminDistance: item.adminDistance,
        scope: {
          id: item.scope?.id,
          name: item.scope?.name,
          scopeType: item.scope?.scopeType,
        },
      };
    });
  }
}
