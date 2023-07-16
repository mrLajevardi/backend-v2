import { Injectable } from '@nestjs/common';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { isEmpty } from 'lodash';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ServiceService } from '../../base/service/services/service.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { ServicePropertiesTableService } from '../../base/crud/service-properties-table/service-properties-table.service';
import { ApplicationPortProfileService } from './application-port-profile.service';
import { FirewallService } from './firewall.service';

@Injectable()
export class EdgeGatewayService {
  constructor(
    private readonly logger: LoggerService,
    private readonly serviceService: ServiceService,
    private readonly sessionService: SessionsService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    readonly applicationPortProfile: ApplicationPortProfileService,
    readonly firewall: FirewallService,
  ) {}

  async createIPSet(options, vdcInstanceId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const ipSets = await mainWrapper.user.ipSets.createIPSet(
      session,
      data.description,
      data.name,
      data.ipList,
      props['edgeName'],
    );
    await this.logger.info(
      'ipSets',
      'createIpSets',
      {
        _object: ipSets.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: ipSets.__vcloudTask.split('task/')[1],
    });
  }

  async deleteIPSet(options, vdcInstanceId, ipSetId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const ipSets = await mainWrapper.user.ipSets.deleteIPSet(session, ipSetId);
    await this.logger.info(
      'ipSets',
      'deleteIpSets',
      {
        _object: ipSets.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: ipSets.__vcloudTask.split('task/')[1],
    });
  }

  async getDhcpForwarder(options, vdcInstanceId) {
    const userId = options.accessToken.userId;
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const edge = await this.servicePropertiesTable.findOne({
      where: {
        and: [
          { ServiceInstanceID: vdcInstanceId },
          { PropertyKey: 'edgeName' },
        ],
      },
    });
    const edgeName = edge.value;
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const dhcpForwarder = await mainWrapper.user.edgeGateway.getDhcpForwarder(
      session,
      edgeName,
    );
    return Promise.resolve(dhcpForwarder);
  }

  async getDnsForwarder(options, vdcInstanceId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const dnsForwarderList = await mainWrapper.user.edgeGateway.getDnsForwarder(
      session,
      props['edgeName'],
    );
    return Promise.resolve(dnsForwarderList);
  }

  async getExternalIPs(options, vdcInstanceId) {
    const serviceEdgeIpRanges = await this.servicePropertiesTable.find({
      where: {
        and: [
          { ServiceInstanceID: vdcInstanceId },
          { PropertyKey: 'edgeIpRange' },
        ],
      },
    });
    const ipAddresses = serviceEdgeIpRanges.map((ip) => {
      return ip.value.split('-')[0];
    });
    return Promise.resolve(ipAddresses);
  }

  async getIPSetsList(
    options,
    vdcInstanceId,
    page = 1,
    pageSize = 25,
    filter = '',
    search,
  ) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    if (filter !== '') {
      filter = ';' + filter;
    }
    if (search) {
      filter = filter + `;(name==*${search}*)`;
    }
    const ipSetsList = await mainWrapper.user.ipSets.getIPSetsList(
      session,
      page,
      pageSize,
      props['edgeName'],
      filter,
    );
    const filteredIPSetList = [];
    for (const ipSet of ipSetsList.values) {
      const ipSetCompleteInfo = await mainWrapper.user.ipSets.getSingleIPSet(
        session,
        ipSet.id,
      );
      filteredIPSetList.push({
        id: ipSet.id,
        name: ipSet.name,
        ipList: ipSetCompleteInfo.ipAddresses,
        description: ipSetCompleteInfo.description,
        status: ipSetCompleteInfo.status,
      });
    }
    const data = {
      ...ipSetsList,
      values: filteredIPSetList,
    };
    delete data.associations;
    return Promise.resolve(data);
  }

  async getSingleIPSet(options, vdcInstanceId, ipSetId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const ipSet = await mainWrapper.user.ipSets.getSingleIPSet(
      session,
      ipSetId,
    );
    const filteredIPSet = {
      id: ipSet.id,
      name: ipSet.name,
      description: ipSet.description,
      ipList: ipSet.ipAddresses,
    };
    return Promise.resolve(filteredIPSet);
  }

  async updateDhcpForwarder(options, data, vdcInstanceId) {
    const userId = options.accessToken.userId;
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const edge = await this.servicePropertiesTable.findOne({
      where: {
        and: [
          { ServiceInstanceID: vdcInstanceId },
          { PropertyKey: 'edgeName' },
        ],
      },
    });
    const edgeName = edge.value;
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const dhcpForwarder =
      await mainWrapper.user.edgeGateway.updateDhcpForwarder(
        data.dhcpServers,
        data.enabled,
        data.version,
        edgeName,
        session,
      );
    await this.logger.info(
      'network',
      'updateDhcpForwarder',
      {
        _object: dhcpForwarder.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: dhcpForwarder.__vcloudTask.split('task/')[1],
    });
  }

  async updateDnsForwarder(options, data, vdcInstanceId) {
    const userId = options.accessToken.userId;
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ ServiceInstanceID: vdcInstanceId }, { PropertyKey: 'orgId' }],
      },
    });
    const edge = await this.servicePropertiesTable.findOne({
      where: {
        and: [
          { ServiceInstanceID: vdcInstanceId },
          { PropertyKey: 'edgeName' },
        ],
      },
    });
    const edgeName = edge.value;
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const config = {
      enabled: data.enabled,
      upstreamServers: data.upstreamServers,
      displayName: data.displayName,
      authToken: session,
    };

    const dnsForwarder = await mainWrapper.user.edgeGateway.updateDnsForwarder(
      config,
      edgeName,
    );
    await this.logger.info(
      'dnsForwarder',
      'updateDnsForwarder',
      {
        _object: dnsForwarder.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: dnsForwarder.__vcloudTask.split('task/')[1],
    });
  }

  async updateIPSet(options, vdcInstanceId, ipSetId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const ipSets = await mainWrapper.user.ipSets.updateIPSet(
      session,
      data.description,
      data.name,
      data.ipList,
      ipSetId,
      props['edgeName'],
    );
    await this.logger.info(
      'ipSets',
      'updateIpSets',
      {
        _object: ipSets.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: ipSets.__vcloudTask.split('task/')[1],
    });
  }
}
