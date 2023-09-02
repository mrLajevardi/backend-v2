import { BadRequestException, Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { Builder } from 'xml2js';
import { isEmpty } from 'lodash';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';
import { VmGetWrapperService } from './vm-get-wrapper.service';
import { UpdateGuestCustomizationBody } from 'src/wrappers/vcloud-wrapper/services/user/vm/dto/update-guest-customazation-dto';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import {
  Combinations,
  DiskAdaptor,
  GetHardDiskControllersDto,
  UpdateDiskSectionDto,
} from './dto/update-disk-section.dto';
import { NetworkConnection } from 'src/wrappers/vcloud-wrapper/services/user/vm/dto/update-network-section.dto';
import { UpdateVmDto } from './dto/update-vm.dto';
@Injectable()
export class VmUpdateWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly vdcWrapperService: VdcWrapperService,
    private readonly vmGetWrapperService: VmGetWrapperService,
  ) {}
  async updateDiskSection(
    authToken: string,
    vmId: string,
    diskSettings: UpdateDiskSectionDto[],
    vdcId: string,
  ): Promise<VcloudTask> {
    const vmInfo = await this.vmGetWrapperService.getVApp(authToken, vmId);
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
          if (targetAdaptor == 3 || targetAdaptor == 5 || targetAdaptor == 2) {
            targetAdaptor = 4;
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
  private async calcBusCombination(
    settings: UpdateDiskSectionDto[],
    authToken: string,
    vdcId: string,
  ): Promise<Combinations> {
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
        adaptor = 4;
      }
      if (setting.diskId === null) {
        console.log(adaptor, '💀');
        combinations[adaptor].push(setting);
      } else {
        oldCombinations[adaptor].push(setting);
      }
    });
    let bus: DiskAdaptor;
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
        throw new BadRequestException();
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
    return combinations;
  }
  private async getHardDiskControllers(
    authToken: string,
    vdcId: string,
  ): Promise<GetHardDiskControllersDto> {
    const hardwareInfo = await this.vdcWrapperService.getHardwareInfo(
      authToken,
      vdcId,
    );
    console.log(hardwareInfo);
    let adaptors: GetHardDiskControllersDto;
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
    const controllers: GetHardDiskControllersDto = {};
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
  async updateGuestCustomization(
    authToken: string,
    vmId: string,
    config: Omit<UpdateGuestCustomizationBody, '_type'>,
  ): Promise<VcloudTask> {
    const requestBody = {
      _type: 'GuestCustomizationSectionType',
      ...config,
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
  async updateMedia(
    authToken: string,
    mediaId: string,
    name: string,
  ): Promise<VcloudTask> {
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
  async updateNetworkSection(
    authToken: string,
    vmId: string,
    networks: NetworkConnection[],
    primaryNetworkConnectionIndex: number,
  ): Promise<VcloudTask> {
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
  async updateVAppTemplate(
    authToken: string,
    templateId: string,
    name: string,
    description: string,
  ): Promise<VcloudTask> {
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
  async updateVm(
    authToken: string,
    vdcId: string,
    config: UpdateVmDto,
    vAppId: string,
  ): Promise<void> {
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
    const endpoint = 'VmEndpointService.updateVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    await this.vcloudWrapperService.request(wrapper(options));
    return;
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
    authToken: string,
    vmId: string,
    numCpus: number,
    numCoresPerSocket: number,
    memory: number,
    memoryHotAddEnabled: boolean,
    cpuHotAddEnabled: boolean,
    nestedHypervisorEnabled: boolean,
  ): Promise<VcloudTask> {
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
  async updateVmGeneralSection(
    authToken: string,
    vmId: string,
    name: string,
    computerName: string,
    description: string,
    osType: string,
    bootDelay: number,
    enterBIOSSetup: boolean,
  ): Promise<VcloudTask> {
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
}
