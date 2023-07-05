import { Injectable } from '@nestjs/common';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { isEmpty, isNil } from 'lodash';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ServiceService } from '../base/service/services/service.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { OrganizationTableService } from '../base/crud/organization-table/organization-table.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';

@Injectable()
export class EdgeGatewayService {
constructor(
    private readonly logger : LoggerService,
    private readonly serviceService : ServiceService,
    private readonly sessionService : SessionsService,
    private readonly organizationTable : OrganizationTableService,
    private readonly servicePropertiesTable : ServicePropertiesTableService
){}

/**
 * @param {Object} app
 * @param {Object} options
 * @param {String} vdcInstanceId
 * @param {Object} data
 * @return {Promise}
 */
async addToFirewallList(options, vdcInstanceId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const firewallList = await mainWrapper.user.firewall.getFirewallList(session, props['edgeName']);
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
    const firewall = await mainWrapper.user.firewall
        .updateFirewallList(session, filteredFirewall.userDefinedRules, props['edgeName']);
    await this.logger.info(
        'firewall',
        'updateFirewallList',
        {
          _object: firewall.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  }
  

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {Object} data
   * @return {Promise}
   */
  async createApplicationPortProfile(options, vdcInstanceId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const vcloudOrg = await this.organizationTable.findById(props['orgId']);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const config = {
      orgId: vcloudOrg.orgId,
      vdcId: props['vdcId'],
      applicationPorts: data.applicationPorts,
      name: data.name,
      description: data.description,
    };
    const application = await mainWrapper.user
        .applicationPortProfile.createApplicationPortProfile(session, config);
    await this.logger.info(
        'applicationPortProfiles',
        'createApplicationPortProfiles',
        {
          _object: application.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: application.__vcloudTask.split('task/')[1],
    });
  }
  

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {Object} data
   * @return {void}
   */
  async createIPSet(options, vdcInstanceId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const ipSets = await mainWrapper.user.ipSets
        .createIPSet(session, data.description, data.name, data.ipList, props['edgeName']);
    await this.logger.info(
        'ipSets',
        'createIpSets',
        {
          _object: ipSets.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: ipSets.__vcloudTask.split('task/')[1],
    });
  }

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {String} applicationId
   * @return {Promise}
   */
  async deleteApplicationPortProfile(options, vdcInstanceId, applicationId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const application = await mainWrapper.user.applicationPortProfile
        .deleteApplicationPortProfile(session, applicationId);
    await this.logger.info(
        'applicationPortProfiles',
        'deleteApplicationPortProfiles',
        {
          _object: application.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: application.__vcloudTask.split('task/')[1],
    });
  }

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {String} ruleId
   * @return {Promise}
   */
  async deleteFirewall(options, vdcInstanceId, ruleId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const firewall = await mainWrapper.user.firewall.deleteFirewall(session, ruleId, props['edgeName']);
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  }
  

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {String} ipSetId
   * @return {void}
   */
  async deleteIPSet(options, vdcInstanceId, ipSetId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const ipSets = await mainWrapper.user.ipSets.deleteIPSet(session, ipSetId);
    await this.logger.info(
        'ipSets',
        'deleteIpSets',
        {
          _object: ipSets.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: ipSets.__vcloudTask.split('task/')[1],
    });
  }


  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {String} applicationId
   * @return {Promise}
   */
  async getApplicationPortProfile(options, vdcInstanceId, applicationId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    let applicationPortProfile = await mainWrapper.user.applicationPortProfile
        .getApplicationPortProfile(session,applicationId);
    const ports = applicationPortProfile.applicationPorts.map((ports) => {
      return {
        ports: ports.destinationPorts,
        protocol: ports.protocol,
      };
    });
    applicationPortProfile = {
      id: applicationPortProfile.id,
      name: applicationPortProfile.name,
      description: applicationPortProfile.description,
      applicationPorts: ports,
    };
    return Promise.resolve(applicationPortProfile);
  }


  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {Number} page
   * @param {Number} pageSize
   * @param {String} filter
   * @param {String} search
   * @return {Promise}
   */
  async getApplicationPortProfiles(
      options, vdcInstanceId, page, pageSize, filter, search,
  ) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    if (!isNil(filter)) {
      filter = `((_context==${props['vdcId']}));` + `(${filter})`;
    } else {
      filter = `((_context==${props['vdcId']}))`;
    }
    if (search) {
      filter = filter + `;(name==*${search}*)`;
    }
    let applicationPortProfiles = await mainWrapper.user.applicationPortProfile
        .getApplicationPortProfileList(session, {
          page,
          pageSize,
          filter,
        });
    const filteredApplicationPortProfiles = applicationPortProfiles.data.values.map((application) => {
      const ports = application.applicationPorts.map((ports) => {
        return {
          ports: ports.destinationPorts,
          protocol: ports.protocol,
        };
      });
      return {
        id: application.id,
        name: application.name,
        applicationPorts: ports,
        scope: application.scope,
      };
    });
    applicationPortProfiles = {
      total: applicationPortProfiles.data.resultTotal,
      page: applicationPortProfiles.data.page,
      pageSize: applicationPortProfiles.data.pageSize,
      pageCount: applicationPortProfiles.data.pageCount,
      values: filteredApplicationPortProfiles,
    };
    return applicationPortProfiles;
  }


  
  async getDhcpForwarder(
            options,
      vdcInstanceId,
  ) {
    const userId = options.accessToken.userId;
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ServiceInstanceID: vdcInstanceId}, {PropertyKey: 'orgId'}],
      },
    });
    const edge = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ServiceInstanceID: vdcInstanceId}, {PropertyKey: 'edgeName'}],
      },
    });
    const edgeName = edge.value;
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const dhcpForwarder = await mainWrapper.user.edgeGateway.getDhcpForwarder(session, edgeName);
    return Promise.resolve(dhcpForwarder);
  };

  
  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @return {Promise}
   */
  async getDnsForwarder(options, vdcInstanceId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const dnsForwarderList = await mainWrapper.user.edgeGateway.getDnsForwarder(
        session,
        props['edgeName'],
    );
    return Promise.resolve(dnsForwarderList);
  }

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @return {Promise}
   */
  async getExternalIPs(options, vdcInstanceId) {
    const serviceEdgeIpRanges = await this.servicePropertiesTable.find({
      where: {
        and: [
          {ServiceInstanceID: vdcInstanceId},
          {PropertyKey: 'edgeIpRange'},
        ],
      },
    });
    const ipAddresses = serviceEdgeIpRanges.map((ip) => {
      return ip.value.split('-')[0];
    });
    return Promise.resolve(ipAddresses);
  }
  

  
  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @return {Promise}
   */
  async getFirewallList(options, vdcInstanceId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const firewallList = await mainWrapper.user.firewall.getFirewallList(session, props['edgeName']);
    const filteredFirewall = {
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
  

  
  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {Number} page
   * @param {Number} pageSize
   * @param {String} filter
   * @param {String} search
   * @return {Promise}
   */
  async getIPSetsList(
      options, vdcInstanceId, page = 1, pageSize = 25, filter = '', search,
  ) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    if (filter !== '') {
      filter = ';'+ filter;
    }
    if (search) {
      filter = filter + `;(name==*${search}*)`;
    }
    const ipSetsList = await mainWrapper.user.ipSets
        .getIPSetsList(session, page, pageSize, props['edgeName'], filter);
    const filteredIPSetList = [];
    for (const ipSet of ipSetsList.values) {
      const ipSetCompleteInfo = await mainWrapper.user.ipSets.getSingleIPSet(session, ipSet.id);
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
  

  
  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {String} ruleId
   * @return {Promise}
   */
  async getSingleFirewall(options, vdcInstanceId, ruleId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const firewall = await mainWrapper.user.firewall
        .getSingleFirewall(session, ruleId, props['edgeName']);
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
  

  
  async getSingleIPSet(options, vdcInstanceId, ipSetId) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const ipSet = await mainWrapper.user.ipSets.getSingleIPSet(session, ipSetId);
    const filteredIPSet = {
      id: ipSet.id,
      name: ipSet.name,
      description: ipSet.description,
      ipList: ipSet.ipAddresses,
    };
    return Promise.resolve(filteredIPSet);
  };

  
  
  async updateApplicationPortProfile(
      options, vdcInstanceId, data, applicationId,
  )  {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const vcloudOrg = await this.organizationTable.findById(props['orgId']);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const config = {
      orgId: vcloudOrg.orgId,
      vdcId: props['vdcId'],
      applicationPorts: data.applicationPorts,
      name: data.name,
      description: data.description,
    };
    const application = await mainWrapper.user.applicationPortProfile
        .updateApplicationPortProfile(session, applicationId, config);
    await this.logger.info(
        'applicationPortProfiles',
        'updateApplicationPortProfiles',
        {
          _object: application.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: application.__vcloudTask.split('task/')[1],
    });
  };

  
  
  async updateDhcpForwarder(
            options,
      data,
      vdcInstanceId,
  ) {
    const userId = options.accessToken.userId;
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ServiceInstanceID: vdcInstanceId}, {PropertyKey: 'orgId'}],
      },
    });
    const edge = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ServiceInstanceID: vdcInstanceId}, {PropertyKey: 'edgeName'}],
      },
    });
    const edgeName = edge.value;
    const orgId = serviceOrg.value;
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const dhcpForwarder = await mainWrapper.user.edgeGateway
        .updateDhcpForwarder(data.dhcpServers, data.enabled, data.version, edgeName, session);
    await this.logger.info(
        'network',
        'updateDhcpForwarder',
        {
          _object: dhcpForwarder.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: dhcpForwarder.__vcloudTask.split('task/')[1],
    });
  };

  
  
  async updateDnsForwarder(
            options,
      data,
      vdcInstanceId,
  ) {
    const userId = options.accessToken.userId;
    const serviceOrg = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ServiceInstanceID: vdcInstanceId}, {PropertyKey: 'orgId'}],
      },
    });
    const edge = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ServiceInstanceID: vdcInstanceId}, {PropertyKey: 'edgeName'}],
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
  
    const dnsForwarder = await mainWrapper.user.edgeGateway.updateDnsForwarder(config, edgeName);
    await this.logger.info(
        'dnsForwarder',
        'updateDnsForwarder',
        {
          _object: dnsForwarder.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: dnsForwarder.__vcloudTask.split('task/')[1],
    });
  };
  
  async updateFirewallList(options, vdcInstanceId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
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
    const firewall = await mainWrapper.user.firewall
        .updateFirewallList(session, config, props['edgeName']);
    await this.logger.info(
        'firewall',
        'updateFirewallList',
        {
          _object: firewall.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  };
  
  
  async updateIPSet(options, vdcInstanceId, ipSetId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const ipSets = await mainWrapper.user.ipSets
        .updateIPSet(session, data.description, data.name, data.ipList, ipSetId, props['edgeName']);
    await this.logger.info(
        'ipSets',
        'updateIpSets',
        {
          _object: ipSets.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: ipSets.__vcloudTask.split('task/')[1],
    });
  };
  
  
  async updateSingleFirewall(options, vdcInstanceId, ruleId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
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
    const firewall = await mainWrapper.user.firewall
        .updateSingleFirewall(session, ruleId, config, props['edgeName']);
    await this.logger.info(
        'firewall',
        'updateFirewall',
        {
          _object: firewall.__vcloudTask.split('task/')[1],
        },
        {...options.locals},
    );
    return Promise.resolve({
      taskId: firewall.__vcloudTask.split('task/')[1],
    });
  };
  
}
