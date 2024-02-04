import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IpSecVpnStatusResultType {
  @ApiResponseProperty({
    type: String,
  })
  tunnelStatus: string;

  @ApiResponseProperty({
    type: String,
  })
  ikeServiceStatus: string;

  @ApiResponseProperty({
    type: String,
  })
  ikeFailedReason?: string;
}

export class IpSecVpnStatusResultDto extends BaseResultDto {
  collection(items: IpSecVpnStatusResultType[]): any[] {
    return items.map((item: IpSecVpnStatusResultType) => {
      return this.toArray(item);
    });
  }

  toArray(item: IpSecVpnStatusResultType): IpSecVpnStatusResultType {
    return {
      tunnelStatus: item.tunnelStatus,
      ikeFailedReason: item.ikeFailedReason,
      ikeServiceStatus: item.ikeServiceStatus,
    };
  }
}
