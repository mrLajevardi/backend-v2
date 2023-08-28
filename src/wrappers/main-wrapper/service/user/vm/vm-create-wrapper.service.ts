import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { Builder } from 'xml2js';
import { isEmpty, isNil } from 'lodash';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';
import { AdminOrgWrapperService } from '../../admin/org/admin-org-wrapper.service';
import { vcdConfig } from 'src/wrappers/main-wrapper/vcdConfig';
@Injectable()
export class VmCreateWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly vdcWrapperService: VdcWrapperService,
    private readonly adminOrgWrapperService: AdminOrgWrapperService,
  ) {}
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
}
