import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { SessionsService } from '../base/sessions/sessions.service';
import { EdgeService } from '../vdc/service/edge.service';
import { ServicePropertiesService } from '../base/service-properties/service-properties.service';

@Injectable()
export class NatService {
  constructor(
    private readonly logger: LoggerService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionService: SessionsService,
  ) {}

  async createNatRule(data, options, serviceInstanceId) {
    // const types = {
    //   DNAT: ["externalAddresses", "dnatExternalPort", "internalAddresses"],
    //   SNAT: ["externalAddresses", "internalAddresses", "snatDestinationAddresses"],
    //   NO_DNAT: ["externalAddresses", "dnatExternalPort"],
    //   NO_SNAT: ["internalAddresses", "snatDestinationAddresses"],
    //   REFLEXIVE: ["externalAddresses", "internalAddresses"]
    // }
    const props = await this.servicePropertiesService.getAllServiceProperties(
      serviceInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      props['orgId'],
    );
    const config = {
      enabled: data.enabled,
      logging: false,
      priority: data.priority,
      firewallMatch: data.firewallMatch,
      dnatExternalPort: data.externalPort,
      externalAddresses: data.externalIP,
      internalAddresses: data.internalIP,
      internalPort: null,
      name: data.name,
      snatDestinationAddresses: data.destinationIP || null,
      applicationPortProfile: data.applicationPortProfile || null,
      type: data.type,
      description: data?.description || null,
      authToken: session,
    };
    const nat = await mainWrapper.user.nat.createNatRule(
      config,
      props['edgeName'],
    );
    // await this.logger.info(
    //   'nat',
    //   'createNat',
    //   {
    //     username: options.locals.username,
    //     natName: data.name,
    //     // task id
    //     _object: nat.__vcloudTask.split('task/')[1],
    //   },
    //   { ...options.locals },
    // );
    return Promise.resolve({
      taskId: nat.__vcloudTask.split('task/')[1],
    });
  }

  async deleteNatRule(options, serviceInstanceId, ruleId) {
    const props = await this.servicePropertiesService.getAllServiceProperties(
      serviceInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      props['orgId'],
    );
    const nat = await mainWrapper.user.nat.deleteNatRule(
      session,
      ruleId,
      props['edgeName'],
    );
    // await this.logger.info(
    //   'nat',
    //   'deleteNat',
    //   {
    //     username: options.locals.username,
    //     // task id
    //     _object: nat.__vcloudTask.split('task/')[1],
    //   },
    //   { ...options.locals },
    // );
    return Promise.resolve({
      taskId: nat.__vcloudTask.split('task/')[1],
    });
  }

  async getNatRule(options, serviceInstanceId, ruleId) {
    const props = await this.servicePropertiesService.getAllServiceProperties(
      serviceInstanceId,
    );
    const session = await await this.sessionService.checkUserSession(
      options.user.userId,
      props['orgId'],
    );
    let natRule = await mainWrapper.user.nat.getNatRule(
      session,
      ruleId,
      props['edgeName'],
    );
    natRule = {
      id: natRule.id,
      enabled: natRule.enabled,
      logging: natRule.logging,
      priority: natRule.priority,
      firewallMatch: natRule.firewallMatch,
      name: natRule.name,
      externalIP: natRule.externalAddresses,
      internalIP: natRule.internalAddresses,
      destinationIP: natRule.snatDestinationAddresses,
      externalPort: natRule.dnatExternalPort,
      applicationPortProfile: natRule.applicationPortProfile,
      description: natRule.description,
      type: natRule.type,
    };
    return Promise.resolve(natRule);
  }

  async getNatRules(options, serviceInstanceId, pageSize = 25, getAll = false) {
    const props = await this.servicePropertiesService.getAllServiceProperties(
      serviceInstanceId,
    );
    const session = await await this.sessionService.checkUserSession(
      options.user.userId,
      props['orgId'],
    );
    const allNatsList = await this.getAllNats(
      session,
      pageSize,
      '',
      props['edgeName'],
      [],
      getAll,
    );
    return Promise.resolve(allNatsList);
  }
  /**
   * @param {String} session
   * @param {Number} pageSize
   * @param {String} nextPage
   * @param {String} edgeName
   * @param {Array} allNatsList
   * @param {Boolean} getAll
   */
  async getAllNats(session, pageSize, nextPage, edgeName, allNatsList, getAll) {
    const natRules = await mainWrapper.user.nat.getNatRuleList(
      session,
      pageSize,
      nextPage,
      edgeName,
    );
    const natRulesData = natRules.data;
    const natsList = natRulesData.values.map((value) => {
      return {
        id: value.id,
        enabled: value.enabled,
        logging: value.logging,
        priority: value.priority,
        firewallMatch: value.firewallMatch,
        name: value.name,
        externalIP: value.externalAddresses,
        internalIP: value.internalAddresses,
        destinationIP: value.snatDestinationAddresses,
        externalPort: value.dnatExternalPort,
        applicationPortProfile: value.applicationPortProfile,
        description: value.description,
        type: value.type,
      };
    });
    allNatsList = allNatsList.concat(natsList);
    const nextPageLink = natRules.headers['link']
      .split(',')
      .filter((link) => link.includes(`rel="nextPage"`));
    if (nextPageLink.length === 0 || getAll === false) {
      console.log('hell', nextPageLink.length, getAll);
      return allNatsList;
    }
    let nextPageCursor = nextPageLink[0].split('cursor=')[1].split('>')[0];
    if (nextPageCursor.includes('%')) {
      nextPageCursor = nextPageCursor.split('%')[0];
    }
    console.log(nextPageCursor);
    return this.getAllNats(
      session,
      pageSize,
      nextPageCursor,
      edgeName,
      allNatsList,
      getAll,
    );
  }

  async updateNatRule(data, options, serviceInstanceId, ruleId) {
    // const types = {
    //   DNAT: ["externalAddresses", "dnatExternalPort", "internalAddresses"],
    //   SNAT: ["externalAddresses", "internalAddresses", "snatDestinationAddresses"],
    //   NO_DNAT: ["externalAddresses", "dnatExternalPort"],
    //   NO_SNAT: ["internalAddresses", "snatDestinationAddresses"],
    //   REFLEXIVE: ["externalAddresses", "internalAddresses"]
    // }
    const props = await this.servicePropertiesService.getAllServiceProperties(
      serviceInstanceId,
    );
    const session = await await this.sessionService.checkUserSession(
      options.user.userId,
      props['orgId'],
    );
    const config = {
      dnatExternalPort: data.externalPort,
      externalAddresses: data.externalIP,
      internalAddresses: data.internalIP,
      internalPort: null,
      name: data.name,
      enabled: data.enabled,
      logging: false,
      priority: data.priority,
      firewallMatch: data.firewallMatch,
      snatDestinationAddresses: data.destinationIP || null,
      applicationPortProfile: data.applicationPortProfile || null,
      type: data.type,
      description: data?.description || null,
      authToken: session,
      ruleId,
    };
    const nat = await mainWrapper.user.nat.updateNatRule(
      config,
      props['edgeName'],
    );
    // await this.logger.info(
    //   'nat',
    //   'updateNat',
    //   {
    //     username: options.locals.username,
    //     // task id
    //     _object: nat.__vcloudTask.split('task/')[1],
    //   },
    //   { ...options.locals },
    // );
    return Promise.resolve({
      taskId: nat.__vcloudTask.split('task/')[1],
    });
  }
}
