import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';

@Injectable()
export class DhcpService {
  constructor(
    private readonly logger: LoggerService,
    private readonly sessionService: SessionsService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
  ) {}

  async createDhcpBinding(options, vdcInstanceId, networkId, data) {
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(
      options.user.id,
      orgId,
    );
    const dhcpBinding = await mainWrapper.user.dhcp.createDhcpBinding(
      session,
      networkId,
      {
        name: data.name,
        description: data.description,
        ipAddress: data.ipAddress,
        macAddress: data.macAddress,
        leaseTime: data.leaseTime,
        dhcpV4BindingConfig: {
          gatewayIpAddress: data.dhcpV4BindingConfig.gatewayIpAddress,
          hostName: data.dhcpV4BindingConfig.hostName,
        },
        dnsServers: data.dnsServers,
      },
    );
    await this.logger.info(
      'dhcp',
      'createDhcpBinding',
      {
        _object: dhcpBinding.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: dhcpBinding.__vcloudTask.split('task/')[1],
    });
  }

  async deleteDhcpBinding(options, vdcInstanceId, networkId, bindingId) {
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(
      options.user.id,
      orgId,
    );
    const dhcpBinding = await mainWrapper.user.dhcp.deleteDhcpBinding(
      session,
      networkId,
      bindingId,
    );
    await this.logger.info(
      'dhcp',
      'deleteDhcpBinding',
      {
        _object: dhcpBinding.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      __vcloudTask: dhcpBinding['headers']['location'],
    });
  }

  async deleteDhcp(options, vdcInstanceId, networkId) {
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(
      options.user.id,
      orgId,
    );
    const dhcp = await mainWrapper.user.dhcp.deleteDhcp(session, networkId);
    await this.logger.info(
      'dhcp',
      'deleteDhcp',
      {
        _object: dhcp.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: dhcp.__vcloudTask.split('task/')[1],
    });
  }

  async getDhcpBindings(
    session,
    pageSize,
    nextPage,
    networkId,
    allDhcpBindings,
    getAll,
  ) {
    const dhcpBindings = await mainWrapper.user.dhcp.getAllDhcpBindings(
      session,
      networkId,
      pageSize,
      nextPage,
    );
    const filteredDhcpBindings = dhcpBindings.data.values.map((binding) => {
      return {
        id: binding.id,
        name: binding.name,
        description: binding.description,
        macAddress: binding.macAddress,
        ipAddress: binding.ipAddress,
        leaseTime: binding.leaseTime,
        dnsServers: binding.dnsServers || [],
        dhcpV4BindingConfig: binding.dhcpV4BindingConfig,
        version: binding.version.version,
      };
    });
    allDhcpBindings = allDhcpBindings.concat(filteredDhcpBindings);
    const nextPageLink = dhcpBindings.headers['link']
      .split(',')
      .filter((link) => link.includes(`rel="nextPage"`));
    if (nextPageLink.length === 0 || getAll === false) {
      console.log('hell', nextPageLink.length, getAll);
      return allDhcpBindings;
    }
    let nextPageCursor = nextPageLink[0].split('cursor=')[1].split('>')[0];
    if (nextPageCursor.includes('%')) {
      nextPageCursor = nextPageCursor.split('%')[0];
    }
    return this.getDhcpBindings(
      session,
      pageSize,
      nextPageCursor,
      networkId,
      allDhcpBindings,
      getAll,
    );
  }

  async getAllDhcpBindings(
    options,
    vdcInstanceId,
    networkId,
    pageSize,
    getAll,
  ) {
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(
      options.user.id,
      orgId,
    );
    const allDhcpBindings = this.getDhcpBindings(
      session,
      pageSize,
      '',
      networkId,
      [],
      getAll,
    );
    return Promise.resolve(allDhcpBindings);
  }

  async getDhcpBinding(options, vdcInstanceId, networkId, bindingId) {
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(
      options.user.id,
      orgId,
    );
    const dhcpBinding = await mainWrapper.user.dhcp.getDhcpBinding(
      session,
      networkId,
      bindingId,
    );
    const filteredDhcpBindings = {
      id: dhcpBinding.id,
      name: dhcpBinding.name,
      description: dhcpBinding.description,
      macAddress: dhcpBinding.macAddress,
      ipAddress: dhcpBinding.ipAddress,
      leaseTime: dhcpBinding.leaseTime,
      dnsServers: dhcpBinding.dnsServers || [],
      dhcpV4BindingConfig: dhcpBinding.dhcpV4BindingConfig,
      version: dhcpBinding.version.version,
    };
    return Promise.resolve(filteredDhcpBindings);
  }

  async getDhcp(options, vdcInstanceId, networkId) {
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(
      options.user.id,
      orgId,
    );
    const network = await mainWrapper.user.network.getNetwork(
      session,
      1,
      10,
      `id==${networkId}`,
    );
    console.log(network);
    const targetSubnet = network.values[0].subnets.values[0];
    const subnet = `${targetSubnet.gateway}/${targetSubnet.prefixLength}`;
    const dhcp = await mainWrapper.user.dhcp.getDhcp(session, networkId);
    return Promise.resolve({
      ...dhcp,
      ipAddress: dhcp.ipAddress || targetSubnet.gateway,
      subnet,
    });
  }

  async updateDhcpBinding(
    options,
    vdcInstanceId,
    networkId,
    bindingId,
    data,
  ) {
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(
      options.user.id,
      orgId,
    );
    const dhcpBinding = await mainWrapper.user.dhcp.updateDhcpBinding(
      session,
      networkId,
      {
        name: data.name,
        description: data.description,
        ipAddress: data.ipAddress,
        macAddress: data.macAddress,
        leaseTime: data.leaseTime,
        dhcpV4BindingConfig: {
          gatewayIpAddress: data.dhcpV4BindingConfig.gatewayIpAddress,
          hostName: data.dhcpV4BindingConfig.hostName,
        },
        dnsServers: data.dnsServers,
        version: {
          version: data.version,
        },
      },
      bindingId,
    );
    await this.logger.info(
      'dhcp',
      'updateDhcpBinding',
      {
        _object: dhcpBinding.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: dhcpBinding.__vcloudTask.split('task/')[1],
    });
  }

  async updateDhcp(options, vdcInstanceId, networkId, data) {
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(
      options.user.id,
      orgId,
    );
    const dhcp = await mainWrapper.user.dhcp.updateDhcp(
      session,
      data.dhcpPools,
      data.ipAddress,
      data.dnsServers,
      data.leaseTime,
      networkId,
      data.mode || 'NETWORK',
    );
    await this.logger.info(
      'dhcp',
      'updateDhcp',
      {
        _object: dhcp.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: dhcp.__vcloudTask.split('task/')[1],
    });
  }
}
