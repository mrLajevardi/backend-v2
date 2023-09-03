import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { GetIpSetsListDto } from './dto/get-ip-sets-list.dto';
import { GetIpSetsDto } from './dto/get-ip-sets.dto';

@Injectable()
export class IpSetsWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
  ) {}
  async createIPSet(
    authToken: string,
    description: string,
    name: string,
    ipAddresses: string[],
    edgeName: string,
  ): Promise<VcloudTask> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const requestBody = {
      name,
      description,
      ipAddresses,
      ownerRef: {
        id: gatewayId,
      },
      typeValue: 'IP_SET',
    };
    const options = {
      body: requestBody,
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'IpSetsEndpointService.createIpSetsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: response.headers['location'],
    });
  }
  async deleteIPSet(authToken: string, ipSetId: string): Promise<VcloudTask> {
    const options = {
      urlParams: { ipSetId },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'IpSetsEndpointService.deleteIpSetsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: response.headers['location'],
    });
  }
  async getIPSetsList(
    authToken: string,
    page: number,
    pageSize: number,
    edgeName: string,
    filter = '',
  ): Promise<GetIpSetsListDto> {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const endpoint = 'IpSetsEndpointService.getIpSetsListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request<GetIpSetsListDto>(
      wrapper({
        params: {
          page,
          pageSize,
          filter: `((ownerRef.id==${gatewayId};typeValue==IP_SET))` + filter,
          sortAsc: 'name',
        },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve(response.data);
  }
  async getSingleIPSet(
    authToken: string,
    ipSetId: string,
  ): Promise<GetIpSetsDto> {
    const endpoint = 'IpSetsEndpointService.getIpSetsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ipSet = await this.vcloudWrapperService.request<GetIpSetsDto>(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { ipSetId },
      }),
    );
    return Promise.resolve(ipSet.data);
  }
  async updateIPSet(
    authToken: string,
    description: string,
    name: string,
    ipAddresses: string[],
    ipSetId: string,
    edgeName: string,
  ): Promise<VcloudTask> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const requestBody = {
      name,
      description,
      ipAddresses,
      ownerRef: {
        id: gatewayId,
      },
      typeValue: 'IP_SET',
    };
    const endpoint = 'IpSetsEndpointService.updateIpSetsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ipSet = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { ipSetId },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: requestBody,
      }),
    );
    return Promise.resolve({
      __vcloudTask: ipSet.headers['location'],
    });
  }
}
