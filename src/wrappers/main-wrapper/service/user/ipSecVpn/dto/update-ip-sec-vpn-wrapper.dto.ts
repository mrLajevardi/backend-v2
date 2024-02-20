import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateIpSecVpnLocalEndpointWrapper {
  @IsString()
  localId: string;

  @IsString()
  localAddress: string;

  @IsArray({
    each: true,
  })
  localNetworks: string[];
}

export class UpdateIpSecVpnRemoteEndpointWrapper {
  @IsString()
  remoteId: string;

  @IsString()
  remoteAddress: string;

  @IsArray({
    each: true,
  })
  remoteNetworks: string[];
}

export class UpdateIpSecVpnWrapperDto {
  @IsString()
  gatewayId: string;

  @IsString()
  ipSecVpnId: string;

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
  localEndpoint: UpdateIpSecVpnLocalEndpointWrapper;

  @IsObject()
  remoteEndpoint: UpdateIpSecVpnRemoteEndpointWrapper;
}
