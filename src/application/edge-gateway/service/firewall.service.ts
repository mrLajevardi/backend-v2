import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { isEmpty } from 'lodash';
import { FirewallListDto } from '../dto/firewall-list.dto';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { VdcProperties } from 'src/application/vdc/interface/vdc-properties.interface';
import { FirewallWrapperService } from 'src/wrappers/main-wrapper/service/user/firewall/firewall-wrapper.service';
import { FirewallListItemDto } from '../dto/firewall-list-item.dto';
import { UpdateFirewallBody } from 'src/wrappers/vcloud-wrapper/services/user/edgeGateway/firewall/dto/update-firewall.dto';
import { UpdateFirewallDto } from '../dto/update-firewall.dto';

@Injectable()
export class FirewallService {
  constructor(
    private readonly logger: LoggerService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionService: SessionsService,
    private readonly firewallWrapperService: FirewallWrapperService,
  ) {}
  async addToFirewallList(
    options: SessionRequest,
    vdcInstanceId: string,
    data: FirewallListItemDto,
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
    const firewallList = await this.firewallWrapperService.getFirewallList(
      session,
      props['edgeName'],
    );
    const filteredFirewall = {
      systemRules: firewallList.systemRules,
      userDefinedRules: firewallList.userDefinedRules,
      defaultRules: firewallList.defaultRules,
    };
    for (const key in filteredFirewall) {
      const firewall = filteredFirewall[key];
      if (!isEmpty(firewall)) {
        filteredFirewall[key] = filteredFirewall[key].map((targetFirewall) => {
          return {
            ...targetFirewall,
            direction: 'IN_OUT',
            ipProtocol: 'IPV4',
            logging: false,
          };
        });
      } else {
        filteredFirewall[key] = [];
      }
    }
    const newFirewall = {
      ...data,
      direction: 'IN_OUT',
      ipProtocol: 'IPV4',
      logging: false,
    };
    const userDefinedRules =
      filteredFirewall.userDefinedRules as UpdateFirewallBody[];
    userDefinedRules.unshift(newFirewall);
    const response = await this.firewallWrapperService.updateFirewallList(
      session,
      filteredFirewall.userDefinedRules,
      props['edgeName'],
    );
    return Promise.resolve({
      taskId: response.__vcloudTask.split('task/')[1],
    });
  }

  async deleteFirewall(
    options: SessionRequest,
    vdcInstanceId: string,
    ruleId: string,
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
    const firewall = await this.firewallWrapperService.deleteFirewall(
      session,
      ruleId,
      props['edgeName'],
    );
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  }

  async getFirewallList(
    options: SessionRequest,
    vdcInstanceId: string,
  ): Promise<FirewallListDto> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props['orgId']),
    );
    const firewallList = await mainWrapper.user.firewall.getFirewallList(
      session,
      props['edgeName'],
    );
    const filteredFirewall: FirewallListDto = {
      systemRules: firewallList.systemRules,
      userDefinedRules: firewallList.userDefinedRules,
      defaultRules: firewallList.defaultRules,
    };
    for (const key of Object.keys(filteredFirewall)) {
      const firewall = filteredFirewall[key];
      console.log(firewall);
      if (!isEmpty(firewall)) {
        filteredFirewall[key] = filteredFirewall[key].map((targetFirewall) => {
          return {
            id: targetFirewall.id,
            name: targetFirewall.name,
            destinationFirewallGroups: targetFirewall.destinationFirewallGroups,
            sourceFirewallGroups: targetFirewall.sourceFirewallGroups,
            applicationPortProfiles: targetFirewall.applicationPortProfiles,
            actionValue: targetFirewall.actionValue,
            enabled: targetFirewall.enabled,
            description: targetFirewall.description,
          };
        });
      }
    }
    return filteredFirewall;
  }

  async getSingleFirewall(
    options: SessionRequest,
    vdcInstanceId: string,
    ruleId: string,
  ): Promise<FirewallListItemDto> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props['orgId']),
    );
    const firewall = await this.firewallWrapperService.getSingleFirewall(
      session,
      ruleId,
      props['edgeName'],
    );
    const filteredFirewall = {
      id: firewall.id,
      name: firewall.name,
      destinationFirewallGroups: firewall.destinationFirewallGroups,
      sourceFirewallGroups: firewall.sourceFirewallGroups,
      applicationPortProfiles: firewall.applicationPortProfiles,
      actionValue: firewall.actionValue,
      enabled: firewall.enabled,
      comments: firewall.comments,
    };
    return Promise.resolve(filteredFirewall);
  }

  async updateFirewallList(
    options: SessionRequest,
    vdcInstanceId: string,
    data: UpdateFirewallDto,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const config = data.firewallList.map((firewall) => {
      const result: UpdateFirewallBody = {
        name: firewall.name,
        applicationPortProfiles: firewall.applicationPortProfiles,
        comments: firewall.comments,
        ipProtocol: 'IPV4',
        logging: false,
        enabled: firewall.enabled,
        sourceFirewallGroups: firewall.sourceFirewallGroups,
        destinationFirewallGroups: firewall.destinationFirewallGroups,
        direction: 'IN_OUT',
        actionValue: firewall.actionValue,
        ...(firewall.id && { id: firewall.id }),
      };
      return result;
    });
    const firewall = await this.firewallWrapperService.updateFirewallList(
      session,
      config,
      props['edgeName'],
    );
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  }

  async updateSingleFirewall(
    options: SessionRequest,
    vdcInstanceId: string,
    ruleId: string,
    data: FirewallListItemDto,
  ): Promise<TaskReturnDto> {
    console.log(ruleId);
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const config = {
      name: data.name,
      applicationPortProfiles: data.applicationPortProfiles,
      comments: data.comments,
      ipProtocol: 'IPV4',
      logging: false,
      enabled: data.enabled,
      sourceFirewallGroups: data.sourceFirewallGroups,
      destinationFirewallGroups: data.destinationFirewallGroups,
      direction: 'IN_OUT',
      actionValue: data.actionValue,
      id: ruleId,
    };
    const firewall = await this.firewallWrapperService.updateSingleFirewall(
      session,
      ruleId,
      config,
      props['edgeName'],
    );
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  }

  async getCountOfFireWall(
    option: SessionRequest,
    vdcInstanceId: string,
  ): Promise<number> {
    const res = await this.getFirewallList(option, vdcInstanceId);

    let count = 0;

    if (res.defaultRules != null) count += res.defaultRules.length;

    if (res.systemRules != null) count += res.systemRules.length;

    if (res.userDefinedRules != null) count += res.userDefinedRules.length;

    return count;
  }
}
