import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';

export class StaticRouteResultDto extends BaseResultDto {
  collection(items: any[]) {
    return items.map((item) => {
      return this.toArray(item);
    });
  }

  toArray(item: any) {
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

  nextHopeToArray(items: any[]) {
    return items.map((item: any) => {
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
