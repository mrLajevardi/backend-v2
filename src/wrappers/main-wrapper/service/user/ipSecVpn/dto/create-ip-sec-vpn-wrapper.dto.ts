import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class IpSecVpnLocalEndpointWrapper {
  @IsString()
  localId: string;

  @IsString()
  localAddress: string;

  @IsArray({
    each: true,
  })
  localNetworks: string[];
}

export class IpSecVpnRemoteEndpointWrapper {
  @IsString()
  remoteId: string;

  @IsString()
  remoteAddress: string;

  @IsArray({
    each: true,
  })
  remoteNetworks: string[];
}

export class CreateIpSecVpnWrapperDto {
  @IsString()
  gatewayId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  securityType: string;

  @IsBoolean()
  active = true;

  @IsBoolean()
  logging = false;

  @IsString()
  authenticationMode: string;

  @IsString()
  preSharedKey: string;

  @IsOptional()
  @IsString()
  certificateRef?: string;

  @IsOptional()
  @IsString()
  caCertificateRef?: string;

  @IsObject()
  localEndpoint: IpSecVpnLocalEndpointWrapper;

  @IsObject()
  remoteEndpoint: IpSecVpnRemoteEndpointWrapper;
}
