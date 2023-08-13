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
    private readonly adminOrgWrapperService: AdminOrgWrapperService,
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
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @param {Object} snapShotProperties
   * @return {Promise}
   */
  async createSnapShot(authToken, vAppId, snapShotProperties) {
    const request = {
      'root:CreateSnapshotParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          memory: snapShotProperties.memory,
          quiesce: snapShotProperties.quiesce,
        },
      },
    };
    const builder = new Builder();

    const xmlRequest = builder.buildObject(request);
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
      body: xmlRequest,
    };
    const endpoint = 'VmEndpointService.createVmSnapShotEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        ...options,
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   * checks if user-catalog exists
   * @param {String} authToken
   * @return {Promise}
   */
  private async checkCatalog(authToken) {
    const catalogName = 'user-catalog';
    const queryOptions = {
      type: 'catalog',
      page: 1,
      pageSize: 15,
      sortAsc: 'name',
      filter: `name==${catalogName}`,
    };
    const catalogsList: any = await this.vdcWrapperService.vcloudQuery(
      authToken,
      queryOptions,
    );
    let catalogId = null;
    const catalogRecord = catalogsList?.data?.record;
    if (!isNil(catalogRecord) && catalogRecord[0]?.name === catalogName) {
      catalogId = catalogRecord[0].href.split('catalog/')[1];
    }
    return Promise.resolve(catalogId);
  }
  /**
   *
   * @param {String} authToken
   * @param {String} description
   * @param {String} name
   * @param {String} orgId
   * @param {String} containerId
   * @return {Promise}
   */
  async createTemplate(authToken, description, name, orgId, containerId) {
    const check = await this.checkCatalog(authToken);
    let catalogId = check;
    if (isNil(check)) {
      await this.adminOrgWrapperService.createOrgCatalog(
        authToken,
        '',
        'user-catalog',
        orgId,
      );
      catalogId = await this.checkCatalog(authToken);
    }
    const requestBody = {
      name,
      description,
      source: {
        href: `${vcdConfig.baseUrl}/api/vApp/${containerId}`,
      },
      customizeOnInstantiate: true,
    };
    const endpoint = 'VmEndpointService.createTemplateEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const template = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { catalogId },
        body: requestBody,
      }),
    );
    return Promise.resolve({
      __vcloudTask: template.headers['location'],
    });
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vdcId
   * @param {Object} config
   * @param {String} config.name
   * @param {String} config.computerName
   * @param {Number} config.cpuNumber
   * @param {Number} config.coreNumber
   * @param {Number} config.ram
   * @param {Number} config.storage
   * @param {String} config.osType
   * @param {String} config.osType
   * @param {String} config.mediaName
   * @param {String} config.mediaHref
   * @param {number} config.primaryNetworkIndex
   * @param {Boolean} config.powerOn
   * @param {Array<Object>} config.networks
   * @param {String} config.networks.allocationMode
   * @param {String} config.networks.networkAdaptorType
   * @param {String} config.networks.ipAddress
   * @param {String} config.networks.networkName
   * @param {String} config.networks.isConnected
   */
  async createVm(authToken, vdcId, config) {
    const formattedVdcId = vdcId.split(':').slice(-1);
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
    const storage = [];
    if (!isEmpty(config.networks)) {
      config.networks.forEach((network, index) => {
        const networkObj = {
          $: { network: network.networkName },
          'root:NetworkConnectionIndex': index,
          'root:IpAddress': network.ipAddress,
          'root:IsConnected': network.isConnected,
          'root:IpAddressAllocationMode': network.allocationMode,
          'root:NetworkAdapterType': network.networkAdaptorType,
        };
        networks.push(networkObj);
      });
    }
    const busCombination = [
      { busNumber: 0, unitNumber: 0 },
      { busNumber: 0, unitNumber: 1 },
      { busNumber: 0, unitNumber: 2 },
      { busNumber: 0, unitNumber: 3 },
      { busNumber: 0, unitNumber: 4 },
      { busNumber: 0, unitNumber: 5 },
      { busNumber: 0, unitNumber: 6 },
      { busNumber: 1, unitNumber: 0 },
      { busNumber: 1, unitNumber: 1 },
      { busNumber: 1, unitNumber: 1 },
    ];
    config.storage.forEach((storageElem, index) => {
      const storageObj = {
        'root:SizeMb': storageElem.sizeMb,
        'root:UnitNumber': busCombination[index].unitNumber,
        'root:BusNumber': busCombination[index].busNumber,
        'root:AdapterType': 7,
        'root:ThinProvisioned': 'true',
        'root:StorageProfile': {
          $: {
            href: vdcStorageProfileLink,
            type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml',
          },
        },
        'root:overrideVmDefault': 'true',
      };
      storage.push(storageObj);
    });
    const request = {
      'root:CreateVmParams': {
        $: {
          powerOn: config.powerOn,
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          'xmlns:ns3': 'http://schemas.dmtf.org/ovf/envelope/1',
        },
        'root:Description': config.description,
        'root:CreateVm': {
          $: { name: config.name },
          'root:GuestCustomizationSection': {
            'ns3:Info': 'Specifies Guest OS Customization Settings',
            'root:ComputerName': config.computerName,
          },
          'root:NetworkConnectionSection': {
            'ns3:Info': 'Network Configuration for VM',
            'root:PrimaryNetworkConnectionIndex': config.primaryNetworkIndex,
            'root:NetworkConnection': networks,
          },
          'root:VmSpecSection': {
            $: { Modified: 'true' },
            'ns3:Info': 'Virtual Machine specification',
            'root:OsType': config.osType,
            'root:NumCpus': config.cpuNumber,
            'root:NumCoresPerSocket': config.coreNumber,
            'root:CpuResourceMhz': {
              'root:Configured': '0',
            },
            'root:MemoryResourceMb': {
              'root:Configured': config.ram,
            },
            'root:DiskSection': {
              'root:DiskSettings': storage,
            },
            'root:HardwareVersion': 'vmx-19',
            'root:VirtualCpuType': 'VM64',
          },
          'root:ComputePolicy': {
            'root:VmSizingPolicy': {
              $: {
                href: computePolicyId,
              },
            },
          },
        },
        'root:Media': {
          $: {
            href: config.mediaHref,
            name: config.mediaName,
          },
        },
      },
    };
    const builder = new Builder();
    const xml = builder.buildObject(request);
    const endpoint = 'VmEndpointService.createVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const createdVm = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        body: xml,
        urlParams: { vdcId: formattedVdcId },
      }),
    );
    return Promise.resolve({
      __vcloudTask: createdVm.headers['location'],
    });
  }
  /**
   * delete media by given id
   * @param {String} authToken
   * @param {String} mediaId
   */
  async deleteMedia(authToken, mediaId) {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { mediaId },
    };
    const endpoint = 'VmEndpointService.deleteMediaEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const deletedMedia = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: deletedMedia.headers['location'],
    });
  }
  /**
   * delete media by given id
   * @param {String} authToken
   * @param {String} mediaId
   */
  async deleteTemplate(authToken, templateId) {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { templateId },
    };
    const endpoint = 'VmEndpointService.deleteTemplateEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const deletedTemplate = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: deletedTemplate.headers['location'],
    });
  }
  /**
   * delete vm by given id
   * @param {String} authToken
   * @param {String} vAppId
   */
  async deletevApp(authToken, vAppId) {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vmId: vAppId },
    };
    const endpoint = 'VmEndpointService.deleteVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const deletedVapp = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: deletedVapp.headers['location'],
    });
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
   * get a single vm
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async getMediaItem(authToken, mediaItemId) {
    const endpoint = 'VmEndpointService.getMediaItemEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const mediaItem = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { mediaItemId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return mediaItem.data;
  }
  getQuestion = async (authToken, vmId) => {
    const endpoint = 'VmEndpointService.questionEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const question = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId },
      }),
    );
    return question.data;
  };
  /**
   * get a single vm
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  getVApp(authToken, vAppId) {
    const endpoint = 'VmEndpointService.getVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const vApp = this.vcloudWrapperService.request(
      wrapper({
        urlParams: { vmId: vAppId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return vApp;
  }
  getVAppTemplate = (authToken, templateId) => {
    const endpoint = 'VmEndpointService.getVmTemplatesEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const vmTemplate = this.vcloudWrapperService.request(
      wrapper({
        urlParams: {
          vmId: templateId,
        },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return vmTemplate;
  };
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
   *
   * @param {String} authToken
   * @param {String} vmId
   * @param {Object} diskSettings user disk settings
   * @return {Promise}
   */
  async updateDiskSection(authToken, vmId, diskSettings, vdcId) {
    const vmInfo = await this.getVApp(authToken, vmId);
    const vmInfoData: any = vmInfo.data;
    const controllers = await this.calcBusCombination(
      diskSettings,
      authToken,
      vdcId,
    );
    vmInfoData.section.forEach((section) => {
      if (section._type === 'VmSpecSectionType') {
        const updatedDiskSettings = [];
        section.modified = true;
        section.diskSection.diskSettings.forEach((diskSection) => {
          diskSettings.forEach((settings) => {
            if (settings.diskId === diskSection.diskId) {
              const updatedSetting = {
                ...diskSection,
                busNumber: diskSection.busNumber,
                unitNumber: diskSection.unitNumber,
                sizeMb: settings.sizeMb,
              };
              updatedDiskSettings.push(updatedSetting);
            }
          });
        });
        diskSettings.forEach((settings) => {
          let targetAdaptor = settings.adapterType;
          if (
            targetAdaptor == '3' ||
            targetAdaptor == '5' ||
            targetAdaptor == 2
          ) {
            targetAdaptor = '4';
          }
          if (settings.diskId === null) {
            console.log(targetAdaptor, controllers, '👌👌');
            const newSetting = {
              sizeMb: settings.sizeMb,
              unitNumber: controllers[targetAdaptor][0].unitNumber,
              busNumber: controllers[targetAdaptor][0].busNumber,
              adapterType: settings.adapterType,
              thinProvisioned: true,
              overrideVmDefault: false,
              virtualQuantityUnit: 'byte',
              iops: 0,
            };
            updatedDiskSettings.push(newSetting);
            controllers[targetAdaptor].splice(0, 1);
          }
        });
        section.diskSection.diskSettings = updatedDiskSettings;
        console.log(updatedDiskSettings, '❤️❤️❤️');
      }
    });
    const endpoint = 'VmEndpointService.updateVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const diskSection = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId },
        body: vmInfoData,
      }),
    );
    return Promise.resolve({
      __vcloudTask: diskSection.headers['location'],
    });
  }

  private async calcBusCombination(settings, authToken, vdcId) {
    const combinations = {
      '4': [],
      '6': [],
      '7': [],
      '1': [],
    };
    const oldCombinations = {
      '4': [],
      '6': [],
      '7': [],
      '1': [],
    };
    const buses = await this.getHardDiskControllers(authToken, vdcId);
    settings.forEach((setting) => {
      let adaptor = setting.adapterType;
      if (adaptor == 3 || adaptor == 5 || adaptor == 2) {
        adaptor = '4';
      }
      if (setting.diskId === null) {
        console.log(adaptor, '💀');
        combinations[adaptor].push(setting);
      } else {
        oldCombinations[adaptor].push(setting);
      }
    });
    let bus;
    let element = null;
    for (const key in combinations) {
      element = combinations[key];
      if (element.length === 0) {
        continue;
      }
      bus = buses[key];
      const validBusNumberRange = [];
      const validUnitNumberRange = [];
      bus.busNumberRanges.forEach((range) => {
        for (let index = range.begin; index <= range.end; index++) {
          validBusNumberRange.push(index);
        }
      });
      bus.unitNumberRanges.forEach((range) => {
        for (let index = range.begin; index <= range.end; index++) {
          validUnitNumberRange.push(index);
        }
      });
      let validCombCount =
        validBusNumberRange.length * validUnitNumberRange.length;
      if (bus.reservedBusUnitNumber) {
        validCombCount--;
      }
      // check if there is enough combinations for given disks
      if (validCombCount < element.length) {
        throw new BadGatewayException();
      }
      // bus number
      let i = 0;
      // index is number of assigned disk adaptor combinations
      let index = 0;
      while (index < element.length) {
        // unit number
        let j = 0;
        while (index < element.length && j < validUnitNumberRange.length) {
          let combExists = false;
          // checks old combs
          for (const oldDisk of oldCombinations[key]) {
            if (
              oldDisk.unitNumber == validUnitNumberRange[j] &&
              oldDisk.busNumber == validBusNumberRange[i]
            ) {
              combExists = true;
            }
            if (
              (oldDisk.adapterType == 3 ||
                oldDisk.adapterType == 4 ||
                oldDisk.adapterType == 2) &&
              element[index].adapterType == 5
            ) {
              if (oldDisk.busNumber == validBusNumberRange[i]) {
                combExists = true;
              }
            }
            if (
              (element[index].adapterType == 3 ||
                element[index].adapterType == 4 ||
                element[index].adapterType == 2) &&
              oldDisk.adapterType == 5
            ) {
              if (oldDisk.busNumber == validBusNumberRange[i]) {
                combExists = true;
              }
            }
          }
          // checks new combs
          for (const otherDisk of element) {
            // check if combination is duplicate
            if (
              otherDisk.unitNumber == validUnitNumberRange[j] &&
              otherDisk.busNumber == validBusNumberRange[i]
            ) {
              combExists = true;
            }
            // اداپتور با ایدی 5 نباید باس یکسان با بقیه اداپتور های اسکازی داشته باشد
            if (
              (otherDisk.adapterType == 3 ||
                otherDisk.adapterType == 4 ||
                otherDisk.adapterType == 2) &&
              element[index].adapterType == 5
            ) {
              if (otherDisk.busNumber == validBusNumberRange[i]) {
                combExists = true;
              }
            }
            if (
              (element[index].adapterType == 3 ||
                element[index].adapterType == 4 ||
                element[index].adapterType == 2) &&
              otherDisk.adapterType == 5
            ) {
              if (otherDisk.busNumber == validBusNumberRange[i]) {
                combExists = true;
              }
            }
          }
          if (
            bus.reservedBusUnitNumber &&
            bus.reservedBusUnitNumber.unitNumber == validUnitNumberRange[j] &&
            bus.reservedBusUnitNumber.busNumber === validBusNumberRange[i]
          ) {
            combExists = true;
          }
          if (!combExists) {
            element[index].unitNumber = validUnitNumberRange[j];
            element[index].busNumber = validBusNumberRange[i];
            index++;
          }
          j++;
        }
        i++;
      }
    }
    console.log(combinations, '💀💀💀');
    return combinations;
  }
  private async getHardDiskControllers(authToken, vdcId) {
    const hardwareInfo: any = await this.vdcWrapperService.getHardwareInfo(
      authToken,
      vdcId,
    );
    console.log(hardwareInfo);
    const adaptors = {};
    hardwareInfo.hardDiskAdapter.forEach((adaptor) => {
      const busNumberRanges = adaptor.busNumberRanges.range.map((range) => {
        return {
          begin: range.begin,
          end: range.end,
        };
      });
      const unitNumberRanges = adaptor.unitNumberRanges.range.map((range) => {
        return {
          begin: range.begin,
          end: range.end,
        };
      });
      adaptors[adaptor.id] = {
        id: adaptor.id,
        busNumberRanges,
        legacyId: adaptor.legacyId,
        name: adaptor.name,
        reservedBusUnitNumber: adaptor.reservedBusUnitNumber,
        unitNumberRanges,
      };
    });
    const controllers = {};
    Object.keys(adaptors).forEach((key) => {
      controllers[adaptors[key].legacyId] = adaptors[key];
    });
    return controllers;
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vmId
   * @param {Object} config
   * @return {Promise}
   */
  async updateGuestCustomization(authToken, vmId, config) {
    const requestBody = {
      _type: 'GuestCustomizationSectionType',
      enabled: config.enabled,
      changeSid: config.changeSid,
      joinDomainEnabled: config.joinDomainEnabled,
      useOrgSettings: config.useOrgSettings,
      domainName: config.domainName,
      domainUserName: config.domainUserName,
      domainUserPassword: config.domainUserPassword,
      machineObjectOU: config.machineObjectOU,
      adminPasswordEnabled: config.adminPasswordEnabled,
      adminPasswordAuto: config.adminPasswordAuto,
      adminPassword: config.adminPassword,
      adminAutoLogonEnabled: config.adminAutoLogonEnabled,
      adminAutoLogonCount: config.adminAutoLogonCount,
      resetPasswordRequired: config.resetPasswordRequired,
      customizationScript: config.customizationScript,
      computerName: config.computerName,
    };
    const endpoint = 'VmEndpointService.updateGuestCustomizationEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const guestCustomizationSection = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId },
        body: requestBody,
      }),
    );
    return Promise.resolve({
      __vcloudTask: guestCustomizationSection.headers['location'],
    });
  }
  async updateMedia(authToken, mediaId, name) {
    const request = {
      name,
    };
    const options = {
      urlParams: { mediaId },
      headers: { Authorization: `Bearer ${authToken}` },
      body: request,
    };
    const endpoint = 'VmEndpointService.updateMediaEndpoint';
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
 * @param {String} vmId
 * @param {Object} networks
 * @param {Number} primaryNetworkConnectionIndex
 index of primary network connection in networks array
 * @return {Promise}
 */
  async updateNetworkSection(
    authToken,
    vmId,
    networks,
    primaryNetworkConnectionIndex,
  ) {
    networks = networks.map((network) => {
      return {
        ...network,
        ipType: 'IPV_4',
        secondaryIpAddress: null,
        secondaryIpType: null,
        externalIpAddress: null,
        secondaryIpAddressAllocationMode: 'NONE',
      };
    });
    const requestBody = {
      _type: 'NetworkConnectionSectionType',
      primaryNetworkConnectionIndex,
      networkConnection: networks,
    };
    const endpoint = 'VmEndpointService.updateNetworkSectionEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const networkSection = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId },
        body: requestBody,
      }),
    );
    return Promise.resolve({
      __vcloudTask: networkSection.headers['location'],
    });
  }
  async updateVAppTemplate(authToken, templateId, name, description) {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { templateId },
      body: {
        name,
        description,
      },
    };
    const endpoint = 'VmEndpointService.updateVAppTemplateEndpoint';
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
   * @param {String} vdcId
   * @param {Object} config
   * @param {String} vAppId
   * @param {String} config.name
   * @param {String} config.computerName
   * @param {Number} config.cpuNumber
   * @param {Number} config.coreNumber
   * @param {Number} config.ram
   * @param {Number} config.storage
   * @param {String} config.osType
   * @param {String} config.adaptorType
   * @param {String} config.osType
   * @param {String} config.mediaName
   * @param {String} config.mediaHref
   * @param {number} config.primaryNetworkIndex
   * @param {Boolean} config.powerOn
   * @param {Array<Object>} config.networks
   * @param {String} config.networks.allocationMode
   * @param {String} config.networks.networkAdaptorType
   * @param {String} config.networks.ipAddress
   * @param {String} config.networks.networkName
   * @param {String} config.networks.isConnected
   */
  async updateVm(authToken, vdcId, config, vAppId) {
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
      config.networks.forEach((network) => {
        const networkObj = {
          $: { network: network.networkName },
          'root:NetworkConnectionIndex': '0',
          'root:IpAddress': network.ipAddress,
          'root:IsConnected': network.isConnected,
          'root:IpAddressAllocationMode': network.allocationMode,
          'root:NetworkAdapterType': network.networkAdaptorType,
        };
        networks.push(networkObj);
      });
    }
    const request = {
      'root:CreateVmParams': {
        $: {
          powerOn: config.powerOn,
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          'xmlns:ns3': 'http://schemas.dmtf.org/ovf/envelope/1',
        },
        'root:Description': null,
        'root:CreateVm': {
          $: { name: config.name },
          'root:GuestCustomizationSection': {
            'ns3:Info': 'Specifies Guest OS Customization Settings',
            'root:ComputerName': config.computerName,
          },
          'root:NetworkConnectionSection': {
            'ns3:Info': 'Network Configuration for VM',
            'root:PrimaryNetworkConnectionIndex': config.primaryNetworkIndex,
            'root:NetworkConnection': networks,
          },
          'root:VmSpecSection': {
            $: { Modified: 'true' },
            'ns3:Info': 'Virtual Machine specification',
            'root:OsType': config.osType,
            'root:NumCpus': config.cpuNumber,
            'root:NumCoresPerSocket': config.coreNumber,
            'root:CpuResourceMhz': {
              'root:Configured': '0',
            },
            'root:MemoryResourceMb': {
              'root:Configured': config.ram,
            },
            'root:DiskSection': {
              'root:DiskSettings': {
                'root:SizeMb': config.storage,
                'root:UnitNumber': '0',
                'root:BusNumber': '0',
                'root:AdapterType': config.adaptorType,
                'root:ThinProvisioned': 'true',
                'root:StorageProfile': {
                  $: {
                    href: vdcStorageProfileLink,
                    type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml',
                  },
                },
                'root:overrideVmDefault': 'true',
              },
            },
            'root:HardwareVersion': 'vmx-19',
            'root:VirtualCpuType': 'VM64',
          },
          'root:ComputePolicy': {
            'root:VmSizingPolicy': {
              $: {
                href: computePolicyId,
              },
            },
          },
        },
        'root:Media': {
          $: {
            href: config.mediaHref,
            name: config.mediaName,
          },
        },
      },
    };
    const builder = new Builder();

    const xml = builder.buildObject(request);
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
      body: xml,
    };
    const endpoint = 'VmEndpointService.updateNetworkSectionEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const createdVm = await this.vcloudWrapperService.request(wrapper(options));
    const createdVm = await new VcloudWrapper().posts(
      'user.vm.updateVm',
      options,
    );
    return Promise.resolve(createdVm.data);
  }
}
