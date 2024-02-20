import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from '../../../../vcloud-wrapper/services/vcloud-wrapper.service';
import { CreateIpSecVpnWrapperDto } from './dto/create-ip-sec-vpn-wrapper.dto';
import { CreateIpSecVpnDto } from '../../../../vcloud-wrapper/services/user/edgeGateway/ipSecVpn/dto/create-ip-sec-vpn.dto';
import { GetIpSecVpnDto } from '../../../../vcloud-wrapper/services/user/edgeGateway/ipSecVpn/dto/get-ip-sec-vpn.dto';
import { IpSecVpnEndpointService } from '../../../../vcloud-wrapper/services/user/edgeGateway/ipSecVpn/ip-sec-vpn-endpoint.service';
import { FindIpSecVpnDto } from '../../../../vcloud-wrapper/services/user/edgeGateway/ipSecVpn/dto/find-ip-sec-vpn.dto';
import { UpdateIpSecVpnDto } from '../../../../vcloud-wrapper/services/user/edgeGateway/ipSecVpn/dto/update-ip-sec-vpn.dto';
import { UpdateIpSecVpnWrapperDto } from './dto/update-ip-sec-vpn-wrapper.dto';
import { GetDefaultConnectionPropertyDto } from '../../../../vcloud-wrapper/services/user/edgeGateway/ipSecVpn/dto/get-default-connection-property.dto';
import { GetIpSecVpnConnectionPropertyDto } from '../../../../vcloud-wrapper/services/user/edgeGateway/ipSecVpn/dto/get-ip-sec-vpn-connection-property.dto';
import { UpdateIpSecVpnConnectionPropertyWrapperDto } from './dto/update-ip-sec-vpn-connection-property-wrapper.dto';
import { UpdateIpSecVpnConnectionPropertyDto } from '../../../../vcloud-wrapper/services/user/edgeGateway/ipSecVpn/dto/update-ip-sec-vpn-connection-property.dto';

@Injectable()
export class IpSecVpnWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}

  async create(
    authToken: string,
    dto: CreateIpSecVpnWrapperDto,
  ): Promise<{ __vcloudTask: any }> {
    const ipSecVpnDto: CreateIpSecVpnDto = {
      gatewayId: dto.gatewayId,
      body: {
        name: dto.name,
        description: dto.description ?? null,
        securityType: dto.securityType,
        active: dto.active,
        logging: dto.logging,
        authenticationMode: dto.authenticationMode,
        preSharedKey: dto.preSharedKey,
        certificateRef: dto.certificateRef,
        caCertificateRef: dto.caCertificateRef,
        localEndpoint: dto.localEndpoint,
        remoteEndpoint: dto.remoteEndpoint,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const wrapper =
      this.vcloudWrapperService.getWrapper<'IpSecVpnEndpointService'>(
        'IpSecVpnEndpointService',
      );

    const endpoint = wrapper.createIpSecVpnEndpoint(ipSecVpnDto);

    const ipSecVpn = await this.vcloudWrapperService.request(endpoint);

    return Promise.resolve({
      __vcloudTask: ipSecVpn.headers.location,
    });
  }

  async get(
    authToken: string,
    gatewayId: string,
  ): Promise<{ data: any; status: any }> {
    const wrapper: IpSecVpnEndpointService =
      this.vcloudWrapperService.getWrapper<'IpSecVpnEndpointService'>(
        'IpSecVpnEndpointService',
      );
    const ipSecVpnDto: GetIpSecVpnDto = {
      gatewayId: gatewayId,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const endPoint = wrapper.getIpSecVpnEndPoint(ipSecVpnDto);

    const ipSecVpn = await this.vcloudWrapperService.request(endPoint);

    return Promise.resolve({
      data: ipSecVpn.data['values'],
      status: ipSecVpn.data['status'],
    });
  }

  async find(
    authToken: string,
    gatewayId: string,
    ipSecVpnId: string,
  ): Promise<{ data: any }> {
    const wrapper: IpSecVpnEndpointService =
      this.vcloudWrapperService.getWrapper<'IpSecVpnEndpointService'>(
        'IpSecVpnEndpointService',
      );
    const ipSecVpnDto: FindIpSecVpnDto = {
      gatewayId: gatewayId,
      ipSecVpnId: ipSecVpnId,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const endPoint = wrapper.findIpSecVpnEndPoint(ipSecVpnDto);

    const ipSecVpn = await this.vcloudWrapperService.request(endPoint);

    return Promise.resolve({
      data: ipSecVpn.data,
    });
  }

  async delete(
    authToken: string,
    gatewayId: string,
    ipSecVpnId: string,
  ): Promise<{ __vcloudTask: any }> {
    const wrapper: IpSecVpnEndpointService =
      this.vcloudWrapperService.getWrapper<'IpSecVpnEndpointService'>(
        'IpSecVpnEndpointService',
      );
    const ipSecVpnDto: FindIpSecVpnDto = {
      gatewayId: gatewayId,
      ipSecVpnId: ipSecVpnId,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const endPoint = wrapper.deleteIpSecVpnEndPoint(ipSecVpnDto);

    const ipSecVpn = await this.vcloudWrapperService.request(endPoint);

    return Promise.resolve({
      __vcloudTask: ipSecVpn.headers.location,
    });
  }

  async update(
    authToken: string,
    dto: UpdateIpSecVpnWrapperDto,
  ): Promise<{ __vcloudTask: any }> {
    const ipSecVpnDto: UpdateIpSecVpnDto = {
      gatewayId: dto.gatewayId,
      ipSecVpnId: dto.ipSecVpnId,
      body: {
        id: dto.ipSecVpnId,
        name: dto.name,
        description: dto.description ?? null,
        securityType: dto.securityType,
        active: dto.active,
        logging: dto.logging,
        authenticationMode: dto.authenticationMode,
        preSharedKey: dto.preSharedKey,
        certificateRef: dto.certificateRef,
        caCertificateRef: dto.caCertificateRef,
        localEndpoint: dto.localEndpoint,
        remoteEndpoint: dto.remoteEndpoint,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const wrapper =
      this.vcloudWrapperService.getWrapper<'IpSecVpnEndpointService'>(
        'IpSecVpnEndpointService',
      );

    const endpoint = wrapper.updateIpSecVpnEndpoint(ipSecVpnDto);

    const ipSecVpn = await this.vcloudWrapperService.request(endpoint);

    return Promise.resolve({
      __vcloudTask: ipSecVpn.headers.location,
    });
  }

  async getDefaultConnectionProperty(
    authToken: string,
    gatewayId: string,
  ): Promise<{ data: any }> {
    const getDefaultConnectionPropertyDto: GetDefaultConnectionPropertyDto = {
      gatewayId: gatewayId,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const wrapper: IpSecVpnEndpointService =
      this.vcloudWrapperService.getWrapper<'IpSecVpnEndpointService'>(
        'IpSecVpnEndpointService',
      );

    const endPoint = wrapper.getDefaultConnectionProperty(
      getDefaultConnectionPropertyDto,
    );

    const connectionProperty = await this.vcloudWrapperService.request(
      endPoint,
    );

    return Promise.resolve({
      data: connectionProperty.data,
    });
  }

  async getIpSecVpnConnectionProperty(
    authToken: string,
    gatewayId: string,
    ipSecVpnId: string,
  ): Promise<{ data: any }> {
    const getConnectionPropertyDto: GetIpSecVpnConnectionPropertyDto = {
      gatewayId: gatewayId,
      ipSecVpnId: ipSecVpnId,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const wrapper: IpSecVpnEndpointService =
      this.vcloudWrapperService.getWrapper<'IpSecVpnEndpointService'>(
        'IpSecVpnEndpointService',
      );

    const endPoint = wrapper.getIpSecVpnConnectionProperty(
      getConnectionPropertyDto,
    );

    const connectionProperty = await this.vcloudWrapperService.request(
      endPoint,
    );

    return Promise.resolve({
      data: connectionProperty.data,
    });
  }

  async getIpSecVpnStatus(
    authToken: string,
    gatewayId: string,
    ipSecVpnId: string,
  ): Promise<{ data: any }> {
    const wrapper: IpSecVpnEndpointService =
      this.vcloudWrapperService.getWrapper<'IpSecVpnEndpointService'>(
        'IpSecVpnEndpointService',
      );
    const ipSecVpnDto: FindIpSecVpnDto = {
      gatewayId: gatewayId,
      ipSecVpnId: ipSecVpnId,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const endPoint = wrapper.getIpSecVpnStatusEndPoint(ipSecVpnDto);

    const ipSecVpnStatus = await this.vcloudWrapperService.request(endPoint);

    return Promise.resolve({
      data: ipSecVpnStatus.data,
    });
  }

  async getIpSecVpnStatistics(
    authToken: string,
    gatewayId: string,
    ipSecVpnId: string,
  ): Promise<{ data: any }> {
    const wrapper: IpSecVpnEndpointService =
      this.vcloudWrapperService.getWrapper<'IpSecVpnEndpointService'>(
        'IpSecVpnEndpointService',
      );
    const ipSecVpnDto: FindIpSecVpnDto = {
      gatewayId: gatewayId,
      ipSecVpnId: ipSecVpnId,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const endPoint = wrapper.getIpSecVpnStatisticsEndPoint(ipSecVpnDto);

    const ipSecVpnStatistics = await this.vcloudWrapperService.request(
      endPoint,
    );

    return Promise.resolve({
      data: ipSecVpnStatistics.data,
    });
  }

  async updateConnectionProperty(
    authToken: string,
    gatewayId: string,
    ipSecVpnId: string,
    dto: UpdateIpSecVpnConnectionPropertyWrapperDto,
  ): Promise<{ __vcloudTask: any }> {
    const ipSecVpnConnectionPropertyDto: UpdateIpSecVpnConnectionPropertyDto = {
      gatewayId: gatewayId,
      ipSecVpnId: ipSecVpnId,
      body: {
        securityType: dto.securityType,
        dpdProbeInterval: dto.dpdProbeInterval,
        tunnelConfiguration: dto.tunnelConfiguration,
        ikeConfiguration: dto.ikeConfiguration,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const wrapper =
      this.vcloudWrapperService.getWrapper<'IpSecVpnEndpointService'>(
        'IpSecVpnEndpointService',
      );

    const endpoint = wrapper.updateConnectionProperty(
      ipSecVpnConnectionPropertyDto,
    );

    const ipSecVpnConnectionProperty = await this.vcloudWrapperService.request(
      endpoint,
    );

    return Promise.resolve({
      __vcloudTask: ipSecVpnConnectionProperty.headers.location,
    });
  }
}
