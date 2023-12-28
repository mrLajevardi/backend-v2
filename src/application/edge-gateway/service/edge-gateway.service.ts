import { Injectable } from '@nestjs/common';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { ServicePropertiesTableService } from '../../base/crud/service-properties-table/service-properties-table.service';
import { ApplicationPortProfileService } from './application-port-profile.service';
import { FirewallService } from './firewall.service';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { IpSetsDto } from '../dto/ip-sets.dto';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { DhcpForwarderDto } from '../../networks/dto/dhcp-forwarder.dto';
import { IpSetsWrapperService } from 'src/wrappers/main-wrapper/service/user/ipSets/ip-sets-wrapper.service';
import { VdcProperties } from 'src/application/vdc/interface/vdc-properties.interface';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { IPSetDto, UpdateIpSetsDto } from '../dto/ip-set.dto';
import { GetIpSetsListQueryDto, IPSetListDto } from '../dto/ip-set-list.dto';
import { EdgeGatewayWrapperService } from 'src/wrappers/main-wrapper/service/user/edgeGateway/edge-gateway-wrapper.service';
import { IP_SPLITTER } from '../../base/itemType/const/item-type-code-hierarchy.const';

@Injectable()
export class EdgeGatewayService {
  constructor(
    private readonly logger: LoggerService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionService: SessionsService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    readonly applicationPortProfile: ApplicationPortProfileService,
    private readonly ipSetsWrapperService: IpSetsWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
    readonly firewall: FirewallService,
  ) {}

  async createIPSet(
    options: SessionRequest,
    vdcInstanceId: string,
    data: IPSetDto,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props.orgId),
    );
    const ipSets = await this.ipSetsWrapperService.createIPSet(
      session,
      data.description,
      data.name,
      data.ipList,
      props.edgeName,
    );
    return Promise.resolve({
      taskId: ipSets.__vcloudTask.split('task/')[1],
    });
  }

  async deleteIPSet(
    options: SessionRequest,
    vdcInstanceId: string,
    ipSetId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props.orgId),
    );
    const ipSets = await this.ipSetsWrapperService.deleteIPSet(
      session,
      ipSetId,
    );
    return Promise.resolve({
      taskId: ipSets.__vcloudTask.split('task/')[1],
    });
  }

  async getDhcpForwarder(
    options: SessionRequest,
    vdcInstanceId: string,
  ): Promise<DhcpForwarderDto> {
    const userId = options.user.userId;
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId: vdcInstanceId,
        propertyKey: 'orgId',
      },
    });
    const edge = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId: vdcInstanceId,
        propertyKey: 'edgeName',
      },
    });
    const edgeName = edge.value;
    const orgId = parseInt(serviceOrg.value);
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const dhcpForwarder = await this.edgeGatewayWrapperService.getDhcpForwarder(
      session,
      edgeName,
    );
    const data: DhcpForwarderDto = {
      dhcpServers: dhcpForwarder.dhcpServers,
      enabled: dhcpForwarder.enabled,
      version: dhcpForwarder.version.version,
    };
    return Promise.resolve(data);
  }

  async getDnsForwarder(options, vdcInstanceId) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
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

  async getUserIps(
    options: SessionRequest,
    vdcInstanceId: string,
  ): Promise<string[]> {
    const serviceEdgeIpRanges = await this.servicePropertiesTable.find({
      where: {
        serviceInstanceId: vdcInstanceId,
        propertyKey: 'edgeIpRange',
      },
    });
    const ipAddresses = serviceEdgeIpRanges.map((ip) => {
      return ip.value.split(IP_SPLITTER)[0];
    });
    return Promise.resolve(ipAddresses);
  }

  async getIPSetsList(
    options: SessionRequest,
    vdcInstanceId: string,
    query: GetIpSetsListQueryDto,
  ): Promise<IpSetsDto> {
    const userId = options.user.userId;
    const { page, pageSize, search } = query;
    let { filter } = query;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    if (!props.orgId) {
      return Promise.resolve({
        page: 0,
        pageSize: 0,
        values: [],
        pageCount: 0,
        resultTotal: 0,
      });
    }
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props.orgId),
    );
    if (filter) {
      filter = ';' + filter;
    }
    if (search) {
      filter = filter + `;(name==*${search}*)`;
    }

    if (props['edgeName'] === undefined) {
      return Promise.resolve({
        resultTotal: 0,
        page: 0,
        pageSize: 0,
        values: [],
        pageCount: 0,
      });
    }
    const ipSetsList = await this.ipSetsWrapperService.getIPSetsList(
      session,
      page,
      pageSize,
      props['edgeName'],
      filter,
    );
    const filteredIPSetList = [];
    for (const ipSet of ipSetsList.values) {
      const ipSetCompleteInfo = await this.ipSetsWrapperService.getSingleIPSet(
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
    return data;
  }

  async getSingleIPSet(
    options: SessionRequest,
    vdcInstanceId: string,
    ipSetId: string,
  ): Promise<IPSetListDto> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props['orgId']),
    );
    const ipSet = await this.ipSetsWrapperService.getSingleIPSet(
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

  async updateDhcpForwarder(
    options: SessionRequest,
    data: DhcpForwarderDto,
    vdcInstanceId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId: vdcInstanceId,
        propertyKey: 'orgId',
      },
    });
    const edge = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId: vdcInstanceId,
        propertyKey: 'edgeName',
      },
    });
    const edgeName = edge.value;
    const orgId = parseInt(serviceOrg.value);
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const dhcpForwarder =
      await this.edgeGatewayWrapperService.updateDhcpForwarder(
        data.dhcpServers,
        data.enabled,
        data.version,
        edgeName,
        session,
      );
    return Promise.resolve({
      taskId: dhcpForwarder.__vcloudTask.split('task/')[1],
    });
  }

  async updateDnsForwarder(options, data, vdcInstanceId) {
    const userId = options.user.userId;
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId: vdcInstanceId,
        propertyKey: 'orgId',
      },
    });
    const edge = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId: vdcInstanceId,
        propertyKey: 'edgeName',
      },
    });
    const edgeName = edge.value;
    const orgId = parseInt(serviceOrg.value);
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

  async updateIPSet(
    options: SessionRequest,
    vdcInstanceId: string,
    ipSetId: string,
    data: UpdateIpSetsDto,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props['orgId']),
    );
    const ipSets = await this.ipSetsWrapperService.updateIPSet(
      session,
      data.description,
      data.name,
      data.ipList,
      ipSetId,
      props['edgeName'],
    );
    return Promise.resolve({
      taskId: ipSets.__vcloudTask.split('task/')[1],
    });
  }

  async getCountOfIpSet(
    options: SessionRequest,
    vdcInstanceId: string,
  ): Promise<number> {
    const query = {
      page: 1,
      pageSize: 1,
    };
    let count = 0;
    const res = await this.getIPSetsList(options, vdcInstanceId, query);
    count = res.resultTotal;
    //
    // res.values.forEach((ipSet) => {
    //   if (ipSet != undefined && ipSet.values != undefined)
    //     count += ipSet.values.length;
    // });
    return count;
  }
}
