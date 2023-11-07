import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { ServicePropertiesService } from '../base/service-properties/service-properties.service';
import { SessionRequest } from '../../infrastructure/types/session-request.type';
import { NatWrapperService } from 'src/wrappers/main-wrapper/service/user/nat/nat-wrapper.service';
import { VdcProperties } from '../vdc/interface/vdc-properties.interface';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { NatQueryDto } from './dto/nat.dto';
import { NatRulesListDTO } from './dto/nat-rules-list.dto';

@Injectable()
export class NatService {
  constructor(
    private readonly logger: LoggerService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionService: SessionsService,
    private readonly natWrapperService: NatWrapperService,
  ) {}

  async createNatRule(
    data: NatRulesListDTO,
    options: SessionRequest,
    serviceInstanceId: string,
  ): Promise<TaskReturnDto> {
    // const types = {
    //   DNAT: ["externalAddresses", "dnatExternalPort", "internalAddresses"],
    //   SNAT: ["externalAddresses", "internalAddresses", "snatDestinationAddresses"],
    //   NO_DNAT: ["externalAddresses", "dnatExternalPort"],
    //   NO_SNAT: ["internalAddresses", "snatDestinationAddresses"],
    //   REFLEXIVE: ["externalAddresses", "internalAddresses"]
    // }
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        serviceInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      Number(props['orgId']),
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
      snatDestinationAddresses: data.destinationIp || null,
      applicationPortProfile: data.applicationPortProfile || null,
      type: data.type,
      description: data?.description || null,
      authToken: session,
    };
    const nat = await this.natWrapperService.createNatRule(
      config,
      props['edgeName'],
    );
    return Promise.resolve({
      taskId: nat.__vcloudTask.split('task/')[1],
    });
  }

  async deleteNatRule(
    options: SessionRequest,
    serviceInstanceId: string,
    ruleId: string,
  ): Promise<TaskReturnDto> {
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        serviceInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      options.user.userId,
      Number(props['orgId']),
    );
    const nat = await this.natWrapperService.deleteNatRule(
      session,
      ruleId,
      props['edgeName'],
    );
    return Promise.resolve({
      taskId: nat.__vcloudTask.split('task/')[1],
    });
  }

  async getNatRule(
    options: SessionRequest,
    serviceInstanceId: string,
    ruleId: string,
  ): Promise<NatRulesListDTO> {
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        serviceInstanceId,
      );
    const session = await await this.sessionService.checkUserSession(
      options.user.userId,
      Number(props['orgId']),
    );
    const natRule = await this.natWrapperService.getNatRule(
      session,
      ruleId,
      props['edgeName'],
    );
    const result: NatRulesListDTO = {
      id: natRule.id,
      enabled: natRule.enabled,
      logging: natRule.logging,
      priority: natRule.priority,
      firewallMatch: natRule.firewallMatch,
      name: natRule.name,
      externalIP: natRule.externalAddresses,
      internalIP: natRule.internalAddresses,
      destinationIp: natRule.snatDestinationAddresses,
      externalPort: natRule.dnatExternalPort,
      applicationPortProfile: natRule.applicationPortProfile,
      description: natRule.description,
      type: natRule.type,
    };
    return result;
  }

  async getNatRules(
    options: SessionRequest,
    serviceInstanceId: string,
    query: NatQueryDto,
  ): Promise<NatRulesListDTO[]> {
    const { getAll, pageSize } = query;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        serviceInstanceId,
      );
    const session = await await this.sessionService.checkUserSession(
      options.user.userId,
      Number(props['orgId']),
    );
    const allNatsList = await this.getAllNats(
      session,
      pageSize,
      '',
      props['edgeName'],
      [],
      getAll,
    );
    return allNatsList;
  }
  /**
   * @param {String} session
   * @param {Number} pageSize
   * @param {String} nextPage
   * @param {String} edgeName
   * @param {Array} allNatsList
   * @param {Boolean} getAll
   */
  async getAllNats(
    session: string,
    pageSize: number,
    nextPage: string,
    edgeName: string,
    allNatsList: NatRulesListDTO[],
    getAll: boolean,
  ): Promise<NatRulesListDTO[]> {
    const natRules = await this.natWrapperService.getNatRuleList(
      session,
      pageSize,
      nextPage,
      edgeName,
    );
    const natRulesData = natRules.data;
    const natsList: NatRulesListDTO[] = natRulesData.values.map((value) => {
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

  async updateNatRule(
    data: NatRulesListDTO,
    options: SessionRequest,
    serviceInstanceId: string,
    ruleId: string,
  ): Promise<TaskReturnDto> {
    // const types = {
    //   DNAT: ["externalAddresses", "dnatExternalPort", "internalAddresses"],
    //   SNAT: ["externalAddresses", "internalAddresses", "snatDestinationAddresses"],
    //   NO_DNAT: ["externalAddresses", "dnatExternalPort"],
    //   NO_SNAT: ["internalAddresses", "snatDestinationAddresses"],
    //   REFLEXIVE: ["externalAddresses", "internalAddresses"]
    // }
    console.log(options.user.userId);
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
      snatDestinationAddresses: data.destinationIp || null,
      applicationPortProfile: data.applicationPortProfile || null,
      type: data.type,
      description: data?.description || null,
      authToken: session,
      ruleId,
    };
    const nat = await this.natWrapperService.updateNatRule(
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

  async getCountOfNatRules(
    options: SessionRequest,
    serviceInstanceId: string,
  ): Promise<number> {
    const pageSize = 1;
    const natRules = await this.getNatRules(options, serviceInstanceId, {
      pageSize,
      getAll: false,
    });

    // console.log('💕', natRules);

    return natRules.length;
  }
}
