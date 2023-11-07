import { Injectable } from '@nestjs/common';
import { SessionsService } from '../base/sessions/sessions.service';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';
import { NetworkDto } from './dto/network.dto';
import { ServicePropertiesService } from '../base/service-properties/service-properties.service';
import { SessionRequest } from '../../infrastructure/types/session-request.type';
import { NetworkWrapperService } from 'src/wrappers/main-wrapper/service/user/network/network-wrapper.service';
import {
  GetNetworkListDto,
  GetNetworkListQueryDto,
} from './dto/get-network-list.dto';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { VdcProperties } from '../vdc/interface/vdc-properties.interface';

@Injectable()
export class NetworksService {
  constructor(
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionService: SessionsService,
    private readonly networkWrapperService: NetworkWrapperService,
  ) {}

  async createNetwork(
    data: NetworkDto,
    options: SessionRequest,
    vdcInstanceId: string,
  ): Promise<TaskReturnDto> {
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      Number(props.orgId),
    );
    const network = await this.networkWrapperService.createNetwork(
      {
        name: data.name,
        authToken: session,
        dnsServer1: data.dnsServer1,
        dnsServer2: data.dnsServer2,
        dnsSuffix: data.dnsSuffix,
        description: data.description,
        gateway: data.gateway,
        prefixLength: data.prefixLength,
        vdcId: props.vdcId,
        networkType: data.networkType,
        connectionType: vcdConfig.user.network.connectionType,
        connectionTypeValue: vcdConfig.user.network.connectionTypeValue,
      },
      props.edgeName,
    );
    return Promise.resolve({
      taskId: network.__vcloudTask.split('task/')[1],
    });
  }

  async deleteNetwork(
    options: SessionRequest,
    vdcInstanceId: string,
    networkId: string,
  ): Promise<TaskReturnDto> {
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      Number(props.orgId),
    );
    const network = await this.networkWrapperService.deleteNetwork(
      session,
      networkId,
    );
    return Promise.resolve({
      taskId: network.__vcloudTask.split('task/')[1],
    });
  }

  async getNetworks(
    options: SessionRequest,
    vdcInstanceId: string,
    query: GetNetworkListQueryDto,
  ): Promise<GetNetworkListDto> {
    const { page, pageSize, search } = query;
    let filter = query.filter;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      Number(props.orgId),
    );
    if (filter) {
      filter = `((ownerRef.id==${props.vdcId}));` + `${filter}`;
    } else {
      filter = `((ownerRef.id==${props.vdcId}))`;
    }
    if (search) {
      filter = filter + `;(name==*${search}*)`;
    }
    const networks = await this.networkWrapperService.getNetwork(
      session,
      page,
      pageSize,
      filter,
    );
    const networksList = [];
    networks.values.forEach((network) => {
      networksList.push({
        id: network.id,
        name: network.name,
        subnets: network.subnets,
        networkType: network.networkType,
        description: network.description,
        status: network.status,
      });
    });
    const data = {
      page: networks.page,
      pageSize: networks.pageSize,
      pageCount: networks.pageCount,
      resultTotal: networks.resultTotal,
      values: networksList,
    };
    return Promise.resolve(data);
  }

  async updateNetwork(
    data: NetworkDto,
    options: SessionRequest,
    vdcInstanceId: string,
    networkId: string,
  ): Promise<TaskReturnDto> {
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      Number(props.orgId),
    );
    const network = await this.networkWrapperService.updateNetwork(
      {
        name: data.name,
        authToken: session,
        dnsServer1: data.dnsServer1,
        dnsServer2: data.dnsServer2,
        dnsSuffix: data.dnsSuffix,
        description: data.description,
        gateway: data.gateway,
        prefixLength: data.prefixLength,
        vdcId: props.vdcId,
        networkType: data.networkType,
        connectionType: vcdConfig.user.network.connectionType,
        connectionTypeValue: vcdConfig.user.network.connectionTypeValue,
      },
      networkId,
      props.edgeName,
    );
    return Promise.resolve({
      taskId: network.__vcloudTask.split('task/')[1],
    });
  }

  async getCountOfAllNetworks(
    options: SessionRequest,
    vdcInstanceId: string,
  ): Promise<number> {
    const query = {
      pageSize: 1,
      page: 1,
    };
    const res = await this.getNetworks(options, vdcInstanceId, query);
    return res.resultTotal;
  }
}
