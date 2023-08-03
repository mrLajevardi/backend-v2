import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { InvalidServiceParamsException } from 'src/infrastructure/exceptions/invalid-service-params.exception';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { ServiceChecksService } from '../base/service/services/service-checks/service-checks.service';
import validator from 'validator';
import { DhcpService } from './dhcp.service';
import { InvalidIpParamException } from 'src/infrastructure/exceptions/invalid-ip-param.exceptionts';
import { NetworkDto } from './dto/network.dto';
import { ServicePropertiesService } from '../base/service-properties/service-properties.service';

@Injectable()
export class NetworksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionService: SessionsService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly serviceChecksService: ServiceChecksService,
    readonly dhcp: DhcpService,
  ) {}

  async createNetwork(data: NetworkDto, options, vdcInstanceId) {
    await this.checkNetworkParams(data);
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      props['orgId'],
    );
    console.log(props);
    const network = await mainWrapper.user.network.createNetwork(
      {
        name: data.name,
        authToken: session,
        dnsServer1: data.dnsServer1,
        dnsServer2: data.dnsServer2,
        dnsSuffix: data.dnsSuffix,
        ipRanges: {
          values: data.ipRanges,
        },
        description: data.description,
        gateway: data.gateway,
        prefixLength: data.prefixLength,
        vdcId: props['vdcId'],
        networkType: data.networkType,
        connectionType: vcdConfig.user.network.connectionType,
        connectionTypeValue: vcdConfig.user.network.connectionTypeValue,
      },
      props['edgeName'],
    );
    console.log('dfdfsdxxxx');
    // await this.logger.info(
    //   'network',
    //   'createNetwork',
    //   {
    //     _object: network.__vcloudTask.split('task/')[1],
    //   },
    //   { ...options.locals },
    // );
    return Promise.resolve({
      taskId: network.__vcloudTask.split('task/')[1],
    });
  }

  async deleteNetwork(options, vdcInstanceId, networkId) {
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      props['orgId'],
    );
    const network = await mainWrapper.user.network.deleteNetwork(
      session,
      networkId,
    );
    await this.logger.info(
      'network',
      'deleteNetwork',
      {
        _object: network.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: network.__vcloudTask.split('task/')[1],
    });
  }

  async getNetworks(
    options,
    vdcInstanceId,
    page,
    pageSize,
    filter = '',
    search,
  ) {
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      props['orgId'],
    );
    if (filter !== '') {
      filter = `((ownerRef.id==${props['vdcId']}));` + `${filter}`;
    } else {
      filter = `((ownerRef.id==${props['vdcId']}))`;
    }
    if (search) {
      filter = filter + `;(name==*${search}*)`;
    }
    const networks = await mainWrapper.user.network.getNetwork(
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
        subnets: network?.subnets?.values || null,
        networkType: network?.networkType || null,
        description: network?.description,
      });
    });
    const data = {
      ...networks,
      values: networksList,
    };
    delete data.associations;
    return Promise.resolve(data);
  }

  async updateNetwork(data, options, vdcInstanceId, networkId) {
    await this.checkNetworkParams(data);
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    console.log(props);
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      props['orgId'],
    );
    const network = await mainWrapper.user.network.updateNetwork(
      {
        name: data.name,
        authToken: session,
        dnsServer1: data.dnsServer1,
        dnsServer2: data.dnsServer2,
        dnsSuffix: data.dnsSuffix,
        ipRanges: {
          values: data.ipRanges,
        },
        description: data.description,
        gateway: data.gateway,
        prefixLength: data.prefixLength,
        vdcId: props['vdcId'],
        networkType: data.networkType,
        connectionType: vcdConfig.user.network.connectionType,
        connectionTypeValue: vcdConfig.user.network.connectionTypeValue,
      },
      networkId,
      props['edgeName'],
    );
    await this.logger.info(
      'network',
      'updateNetwork',
      {
        _object: network.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: network.__vcloudTask.split('task/')[1],
    });
  }

  async checkNetworkParams(data) {
    if (!this.serviceChecksService.checkNetworkType(data.networkType)) {
      const error = new InvalidServiceParamsException();
      console.log('1');

      return Promise.reject(error);
    }
    const ipParams = ['gateway', 'dnsServer1', 'dnsServer2'];
    for (const ipParam of ipParams) {
      console.log(data, '🍳');
      if (!validator.isIP(data[ipParam]) && data[ipParam].length !== 0) {
        const err = new InvalidIpParamException();
        return Promise.reject(err);
      }
    }
    return Promise.resolve(true);
  }
}
