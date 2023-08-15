import { BadGatewayException, Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { Builder } from 'xml2js';
import { isEmpty, isNil } from 'lodash';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';
import { AdminOrgWrapperService } from '../../admin/org/admin-org-wrapper.service';
import { vcdConfig } from 'src/wrappers/main-wrapper/vcdConfig';

@Injectable()
export class VmWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly vdcWrapperService: VdcWrapperService,
  ) {}
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async acquireVappTicket(authToken, vAppId) {
    const endpoint = 'VmEndpointService.acquireVmTicketEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ticket = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId: vAppId },
        body: {},
      }),
    );
    return ticket;
  }
  /**
   * powerOn vm and force recustomization
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async deployvApp(authToken, vAppId) {
    const request = {
      'root:DeployVAppParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          forceCustomization: true,
        },
      },
    };
    const builder = new Builder();
    const xmlRequest = builder.buildObject(request);
    const endpoint = 'VmEndpointService.deployVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { vmId: vAppId },
        headers: { Authorization: `Bearer ${authToken}` },
        body: xmlRequest,
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   * discards suspend state if vm's state is suspend
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async discardSuspendedStatevApp(authToken, vAppId) {
    const endpoint = 'VmEndpointService.discardSuspendVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { vmId: vAppId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }

  /**
   * insert or eject a media from vm
   * @param {String} authToken
   * @param {String} vAppId
   * @param {Boolean} insert determines if a media should be inserted
   * @param {String} mediaName
   * @param {String} mediaHref
   * @param {String} mediaId
   * @return {Promise}
   */
  async insertOrEjectVappMedia(
    authToken,
    vAppId,
    insert,
    mediaName = null,
    mediaHref = null,
    mediaId = null,
  ) {
    const request = {
      'root:MediaInsertOrEjectParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
        },
      },
    };
    let action = 'ejectMedia';
    if (insert) {
      request['root:MediaInsertOrEjectParams']['root:Media'] = {
        $: {
          href: mediaHref,
          id: mediaId,
          name: mediaName,
        },
      };
      action = 'insertMedia';
    }
    const builder = new Builder();
    const xmlRequest = builder.buildObject(request);
    const endpoint = 'VmEndpointService.insertOrEjectEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: {
          vmId: vAppId,
          action,
        },
        headers: { Authorization: `Bearer ${authToken}` },
        body: xmlRequest,
      }),
    );
    return Promise.resolve({
      __vcloudTask: response.headers['location'],
    });
  }
  /**
   * discards suspend state if vm's state is suspend
   * @param {String} authToken
   * @param {String} vmId
   * @return {Promise}
   */
  async installVmTools(authToken, vmId) {
    const endpoint = 'VmEndpointService.installVmToolsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { vmId: vmId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vdcId
   * @param {Object} config
   * @param {String} config.name
   * @param {String} config.computerName
   * @param {Boolean} config.primaryNetworkIndex
   * @param {Boolean} config.powerOn
   * @param {Array<Object>} config.networks
   * @param {String} config.networks.allocationMode
   * @param {String} config.networks.networkAdaptorType
   * @param {String} config.networks.ipAddress
   * @param {String} config.networks.networkName
   * @param {String} config.sourceHref
   * @param {String} config.sourceId
   * @param {String} config.sourceName
   */
  async instantiateVmFromTemplate(authToken, vdcId, config) {
    const formatedVdcId = vdcId.split(':').slice(-1);
    const computePolicy: any = await this.vdcWrapperService.getVdcComputePolicy(
      authToken,
      vdcId,
    );
    const computePolicyId = computePolicy.values[0].id;
    const query: any = await this.vdcWrapperService.vcloudQuery(authToken, {
      type: 'orgVdcStorageProfile',
      format: 'records',
      page: 1,
      pageSize: 128,
      filterEncoded: true,
      links: true,
      filter: `vdc==${vdcId}`,
    });
    const vdcStorageProfileLink = query.data.record[0].href;
    const networks = [];
    if (!isEmpty(config.networks)) {
      let index = 0;
      config.networks.forEach((network) => {
        const networkObj = {
          $: { network: network.networkName },
          'root:NetworkConnectionIndex': index,
          'root:IpAddress': network.ipAddress,
          'root:IsConnected': network.isConnected,
          'root:IpAddressAllocationMode': network.allocationMode,
          'root:NetworkAdapterType': network.networkAdaptorType,
        };
        index++;
        networks.push(networkObj);
      });
    }
    const request = {
      'root:InstantiateVmTemplateParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          'xmlns:ns0': 'http://schemas.dmtf.org/ovf/envelope/1',
          name: config.name,
          powerOn: config.powerOn,
        },
        'root:Description': config.description,
        'root:SourcedVmTemplateItem': {
          'root:Source': {
            $: {
              href: config.sourceHref,
              id: config.sourceId,
              name: config.sourceName,
              type: 'application/vnd.vmware.vcloud.vm+xml',
            },
          },
          'root:VmTemplateInstantiationParams': {
            'root:NetworkConnectionSection': {
              'ns0:Info': '',
              'root:PrimaryNetworkConnectionIndex': config.primaryNetworkIndex,
              'root:NetworkConnection': networks,
            },
            'root:GuestCustomizationSection': {
              'ns0:Info': 'Specifies Guest OS Customization Settings',
              'root:Enabled': true,
              'root:AdminPasswordAuto': true,
              'root:ComputerName': config.computerName,
            },
          },
          'root:StorageProfile': {
            $: {
              href: vdcStorageProfileLink,
              type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml',
            },
          },
        },
        'root:AllEULAsAccepted': true,
        'root:ComputePolicy': {
          'root:VmSizingPolicy': {
            $: {
              href: computePolicyId,
              id: computePolicyId,
            },
          },
        },
      },
    };
    const builder = new Builder();
    const xmlRequest = builder.buildObject(request);
    const options = {
      body: xmlRequest,
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vdcId: formatedVdcId },
    };
    const endpoint = 'VmEndpointService.instantiateVmFromTemplateEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const createdVm = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: createdVm.headers['location'],
    });
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vdcId
   * @param {Object} config
   * @param {String} config.name
   * @param {String} config.computerName
   * @param {Boolean} config.primaryNetworkIndex
   * @param {Boolean} config.powerOn
   * @param {Array<Object>} config.networks
   * @param {String} config.networks.allocationMode
   * @param {String} config.networks.networkAdaptorType
   * @param {String} config.networks.ipAddress
   * @param {String} config.networks.networkName
   * @param {String} config.sourceHref
   * @param {String} config.sourceId
   * @param {String} config.sourceName
   */
  async instantiateVmFromTemplateAdmin(
    authToken,
    vdcId,
    config,
    computePolicyId,
  ) {
    const formatedVdcId = vdcId.split(':').slice(-1);
    const query: any = await this.vdcWrapperService.vcloudQuery(authToken, {
      type: 'adminOrgVdcStorageProfile',
      format: 'records',
      page: 1,
      pageSize: 128,
      filterEncoded: true,
      links: true,
      filter: `vdc==${vdcId}`,
    });
    const vdcStorageProfileLink = query.data.record[0].href;
    const networks = [];
    if (!isEmpty(config.networks)) {
      let index = 0;
      config.networks.forEach((network) => {
        const networkObj = {
          $: { network: network.networkName },
          'root:NetworkConnectionIndex': index,
          'root:IpAddress': network.ipAddress,
          'root:IsConnected': network.isConnected,
          'root:IpAddressAllocationMode': network.allocationMode,
          'root:NetworkAdapterType': network.networkAdaptorType,
        };
        index++;
        networks.push(networkObj);
      });
    }
    const request = {
      'root:InstantiateVmTemplateParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          'xmlns:ns0': 'http://schemas.dmtf.org/ovf/envelope/1',
          name: config.name,
          powerOn: config.powerOn,
        },
        'root:SourcedVmTemplateItem': {
          'root:Source': {
            $: {
              href: config.sourceHref,
              id: config.sourceId,
              name: config.sourceName,
              type: 'application/vnd.vmware.vcloud.vm+xml',
            },
          },
          'root:VmTemplateInstantiationParams': {
            'root:NetworkConnectionSection': {
              'ns0:Info': '',
              'root:PrimaryNetworkConnectionIndex': config.primaryNetworkIndex,
              'root:NetworkConnection': networks,
            },
            'root:GuestCustomizationSection': {
              'ns0:Info': 'Specifies Guest OS Customization Settings',
              'root:Enabled': true,
              'root:AdminPasswordAuto': true,
              'root:ComputerName': config.computerName,
            },
          },
          'root:StorageProfile': {
            $: {
              href: vdcStorageProfileLink,
              type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml',
            },
          },
        },
        'root:AllEULAsAccepted': true,
        'root:ComputePolicy': {
          'root:VmPlacementPolicy': {
            $: {
              href: computePolicyId,
              id: computePolicyId,
            },
          },
        },
      },
    };
    const builder = new Builder();

    const xmlRequest = builder.buildObject(request);
    const options = {
      body: xmlRequest,
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vdcId: formatedVdcId },
    };
    const endpoint = 'VmEndpointService.instantiateVmFromTemplateEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const createdVm = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: createdVm.headers['location'],
    });
  }
  /**
   * get a single vm
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async partialUpload(authToken, fullAddress, data, header) {
    const endpoint = 'VmEndpointService.partialUploadEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const file = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { fullAddress },
        headers: { Authorization: `Bearer ${authToken}`, ...header },
        body: data,
      }),
    );
    return file;
  }
  postAnswer = async (authToken, vmId, questionId, choiceId) => {
    const endpoint = 'VmEndpointService.answerEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const answer = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId },
        body: {
          questionId,
          choiceId,
        },
      }),
    );
    return Promise.resolve({
      __vcloudTask: answer.headers['location'],
    });
  };
  /**
   * powerOn vm
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async powerOnvApp(authToken, vAppId) {
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'VmEndpointService.powerOnVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   * reset vm
   * @param {String} authToken
   * @param {String} vmId
   * @return {Promise}
   */
  async rebootVm(authToken, vmId) {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vmId },
    };
    const endpoint = 'VmEndpointService.rebootVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @param {String} vAppAction
   * @return {Promise}
   */
  async removeSnapShot(authToken, vAppId) {
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'VmEndpointService.removeVmSnapShot';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   * reset vm
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async resetvApp(authToken, vAppId) {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vmId: vAppId },
    };
    const endpoint = 'VmEndpointService.resetVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @param {String} vAppAction
   * @return {Promise}
   */
  async revertSnapShot(authToken, vAppId) {
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'VmEndpointService.revertVmSnapShot';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   * suspend vm
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async suspendVapp(authToken, vAppId) {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vmId: vAppId },
    };
    const endpoint = 'VmEndpointService.suspendVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   * take resources from vm
   * @param {String} authToken
   * @param {String} vAppId
   * @param {String} vAppAction suspend, powerOff, shutdown(shutdown guest)
   * @return {Promise}
   */
  async undeployvApp(authToken, vAppId, vAppAction) {
    const request = {
      'root:UndeployVAppParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
        },
        'root:UndeployPowerAction': vAppAction,
      },
    };
    const builder = new Builder();

    const xmlRequest = builder.buildObject(request);
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
      body: xmlRequest,
    };
    const endpoint = 'VmEndpointService.undeployVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   * get a single vm
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async uploadFile(authToken, catalogId, data) {
    const endpoint = 'VmEndpointService.undeployVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { catalogId },
        headers: { Authorization: `Bearer ${authToken}` },
        body: data,
      }),
    );
    return response;
  }
}
