import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ServiceService } from '../../base/service/services/service.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { isEmpty } from 'lodash';
import { FirewalListDto } from '../dto/firewall-list.dto';

@Injectable()
export class FirewallService {
  constructor(
    private readonly logger: LoggerService,
    private readonly serviceService: ServiceService,
    private readonly sessionService: SessionsService,
  ) {}
  async addToFirewallList(options, vdcInstanceId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const firewallList = await mainWrapper.user.firewall.getFirewallList(
      session,
      props['edgeName'],
    );
    const filteredFirewall = {
      systemRules: firewallList.systemRules,
      userDefinedRules: firewallList.userDefinedRules,
      defaultRules: firewallList.defaultRules,
    };
    for (const key of Object.keys(filteredFirewall)) {
      const firewall = filteredFirewall[key];
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
      actionValue: data.ruleType,
    };
    delete newFirewall.ruleType;
    filteredFirewall.userDefinedRules.unshift(newFirewall);
    const firewall = await mainWrapper.user.firewall.updateFirewallList(
      session,
      filteredFirewall.userDefinedRules,
      props['edgeName'],
    );
    await this.logger.info(
      'firewall',
      'updateFirewallList',
      {
        _object: firewall.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  }

  async deleteFirewall(options, vdcInstanceId, ruleId) {
    const userId = options.user.id;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const firewall = await mainWrapper.user.firewall.deleteFirewall(
      session,
      ruleId,
      props['edgeName'],
    );
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  }

  async getFirewallList(options, vdcInstanceId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const firewallList = await mainWrapper.user.firewall.getFirewallList(
      session,
      props['edgeName'],
    );
    const filteredFirewall: FirewalListDto = {
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
            ruleType: targetFirewall.actionValue,
            enabled: targetFirewall.enabled,
            description: targetFirewall.description,
          };
        });
      }
    }
    return Promise.resolve(filteredFirewall);
  }

  async getSingleFirewall(options, vdcInstanceId, ruleId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const firewall = await mainWrapper.user.firewall.getSingleFirewall(
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
      ruleType: firewall.actionValue,
      enabled: firewall.enabled,
      description: firewall.description,
    };
    return Promise.resolve(filteredFirewall);
  }

  async updateFirewallList(options, vdcInstanceId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const config = data.firewallList.map((firewall) => {
      const result = {
        name: firewall.name,
        applicationPortProfiles: firewall.applicationPortProfiles,
        comments: firewall.description,
        ipProtocol: 'IPV4',
        logging: false,
        enabled: firewall.enabled,
        sourceFirewallGroups: firewall.sourceFirewallGroups,
        destinationFirewallGroups: firewall.destinationFirewallGroups,
        direction: 'IN_OUT',
        description: firewall.description,
        actionValue: firewall.ruleType,
      };
      if (firewall.id) {
        result['id'] = firewall.id;
      }
      return result;
    });
    const firewall = await mainWrapper.user.firewall.updateFirewallList(
      session,
      config,
      props['edgeName'],
    );
    await this.logger.info(
      'firewall',
      'updateFirewallList',
      {
        _object: firewall.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  }

  async updateSingleFirewall(options, vdcInstanceId, ruleId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const config = {
      name: data.name,
      applicationPortProfiles: data.applicationPortProfiles,
      description: data.description,
      ipProtocol: 'IPV4',
      logging: false,
      enabled: data.enabled,
      sourceFirewallGroups: data.sourceFirewallGroups,
      destinationFirewallGroups: data.destinationFirewallGroups,
      direction: 'IN_OUT',
      actionValue: data.ruleType,
      id: ruleId,
    };
    const firewall = await mainWrapper.user.firewall.updateSingleFirewall(
      session,
      ruleId,
      config,
      props['edgeName'],
    );
    await this.logger.info(
      'firewall',
      'updateFirewall',
      {
        _object: firewall.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  }
}
