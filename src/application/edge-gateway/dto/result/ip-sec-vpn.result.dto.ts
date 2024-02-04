import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class IpSecVpnResultTypeVersion {
  @ApiResponseProperty({
    type: Number,
  })
  version: number;
}

class IpSecVpnResultTypeRemoteEndpoint {
  @ApiResponseProperty({
    type: String,
  })
  remoteId: string;

  @ApiResponseProperty({
    type: String,
  })
  remoteAddress: string;

  @ApiResponseProperty({
    type: Array(String),
  })
  remoteNetworks: string[];
}

export class IpSecVpnResultTypeLocalEndpoint {
  @ApiResponseProperty({
    type: String,
  })
  localId: string;

  @ApiResponseProperty({
    type: String,
  })
  localAddress: string;

  @ApiResponseProperty({
    type: Array(String),
  })
  localNetworks: string[];
}

export class IpSecVpnResultType {
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
    type: Boolean,
  })
  active: boolean;

  @ApiResponseProperty({
    type: IpSecVpnResultTypeLocalEndpoint,
  })
  localEndpoint: IpSecVpnResultTypeLocalEndpoint;

  @ApiResponseProperty({
    type: IpSecVpnResultTypeRemoteEndpoint,
  })
  remoteEndpoint: IpSecVpnResultTypeRemoteEndpoint;

  @ApiResponseProperty({
    type: String,
  })
  authenticationMode: string;

  @ApiResponseProperty({
    type: String,
  })
  preSharedKey?: string;

  @ApiResponseProperty({
    type: String,
  })
  certificateRef?: string;

  @ApiResponseProperty({
    type: String,
  })
  caCertificateRef?: string;

  @ApiResponseProperty({
    type: String,
  })
  connectorInitiationMode: string;

  @ApiResponseProperty({
    type: String,
  })
  securityType: string;

  @ApiResponseProperty({
    type: Boolean,
  })
  logging: boolean;

  @ApiResponseProperty({
    type: IpSecVpnResultTypeVersion,
  })
  version?: IpSecVpnResultTypeVersion;
}

export class IpSecVpnResultDto extends BaseResultDto {
  collection(items: IpSecVpnResultType[]): any[] {
    return items.map((item: IpSecVpnResultType) => {
      return this.toArray(item);
    });
  }

  toArray(item: IpSecVpnResultType): IpSecVpnResultType {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      active: item.active,
      localEndpoint: item.localEndpoint,
      remoteEndpoint: item.remoteEndpoint,
      securityType: item.securityType,
      logging: item.logging,
      authenticationMode: item.authenticationMode,
      connectorInitiationMode: item.connectorInitiationMode,
      preSharedKey: item.preSharedKey ?? null,
    };
  }
}
