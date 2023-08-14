import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { Builder } from 'xml2js';
import { isEmpty, isNil } from 'lodash';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';
import { AdminOrgWrapperService } from '../../admin/org/admin-org-wrapper.service';
import { vcdConfig } from 'src/wrappers/main-wrapper/vcdConfig';
import { VmGetWrapperService } from './vm-get-wrapper.service';
@Injectable()
export class VmUpdateWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly vdcWrapperService: VdcWrapperService,
    private readonly vmGetWrapperService: VmGetWrapperService,
  ) {}
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
    return Promise.resolve(createdVm.data);
  }
  /**
   * compute part in vcloud panel
   * @param {String} authToken
   * @param {String} vmId
   * @param {Number} numCpus
   * @param {Number} numCoresPerSocket
   * @param {String} memory
   * @param {Boolean} memoryHotAddEnabled
   * @param {Boolean} cpuHotAddEnabled
   * @param {Boolean} nestedHypervisorEnabled
   * @return {Promise<Object>}
   */
  async updateVmComputeSection(
    authToken,
    vmId,
    numCpus,
    numCoresPerSocket,
    memory,
    memoryHotAddEnabled,
    cpuHotAddEnabled,
    nestedHypervisorEnabled,
  ) {
    const vmInfo: any = await this.vmGetWrapperService.getVApp(authToken, vmId);
    const vmInfoData = vmInfo.data;
    vmInfoData.section.forEach((section) => {
      if (section._type === 'VmSpecSectionType') {
        section.numCpus = numCpus;
        // modified should be true;
        section.modified = true;
        section.numCoresPerSocket = numCoresPerSocket;
        section.memoryResourceMb.configured = memory;
      }
    });
    vmInfoData.nestedHypervisorEnabled = nestedHypervisorEnabled;
    vmInfoData.vmCapabilities.memoryHotAddEnabled = memoryHotAddEnabled;
    vmInfoData.vmCapabilities.cpuHotAddEnabled = cpuHotAddEnabled;
    const endpoint = 'VmEndpointService.updateVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const computeSection = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId },
        body: vmInfoData,
      }),
    );
    return Promise.resolve({
      __vcloudTask: computeSection.headers['location'],
    });
  }
  /**
   * general section in panel
   * @param {String} authToken
   * @param {String} vmId
   * @param {String} name
   * @param {String} computerName
   * @param {String} description
   * @param {String} osType
   * @param {Number} bootDelay
   * @param {Boolean} enterBIOSSetup
   * @return {Promise<Object>}
   */
  async updateVmGeneralSection(
    authToken,
    vmId,
    name,
    computerName,
    description,
    osType,
    bootDelay,
    enterBIOSSetup,
  ) {
    const vmInfo: any = await this.vmGetWrapperService.getVApp(authToken, vmId);
    const vmInfoData = vmInfo.data;
    // change name
    vmInfoData.name = name;
    // change description
    vmInfoData.description = description;
    vmInfoData.section.forEach((section) => {
      if (section._type === 'OperatingSystemSectionType') {
        // change os type
        section.otherAttributes['{http://www.vmware.com/schema/ovf}osType'] =
          osType;
      }
      if (section._type === 'GuestCustomizationSectionType') {
        // change computer name
        section.computerName = computerName;
      }
    });
    if (vmInfoData.bootOptions) {
      vmInfoData.bootOptions.enterBIOSSetup = enterBIOSSetup;
      vmInfoData.bootOptions.bootDelay = bootDelay;
    }
    const endpoint = 'VmEndpointService.updateVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const generalSection = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId },
        body: vmInfoData,
      }),
    );
    return Promise.resolve({
      __vcloudTask: generalSection.headers['location'],
    });
  }
  /**
   * get a single vm
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async uploadFile(authToken, catalogId, data) {
    const endpoint = 'VmEndpointService.updateNetworkSectionEndpoint';
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
