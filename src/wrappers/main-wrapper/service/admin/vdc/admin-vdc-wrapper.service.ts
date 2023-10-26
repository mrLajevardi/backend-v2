import { Injectable } from '@nestjs/common';
import { vcdConfig } from 'src/wrappers/main-wrapper/vcdConfig';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { AdminEdgeGatewayWrapperService } from '../edgeGateway/admin-edge-gateway-wrapper.service';
import { CreateVdcConfig, CreateVdcDto } from './dto/create-vdc.dto';
import { AxiosResponse } from 'axios';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { UpdateVdcComputePolicyDto } from './dto/update-vdc-compute-policy.dto';
import { UpdateVdcStoragePolicyDto } from './dto/update-vdc-storage-policy.dto';
import { AdminOrgVdcStorageProfileQuery } from '../../user/vdc/dto/instantiate-vm-from.templates-admin.dto';
import { GetProviderVdcsDto } from './dto/get-provider-vdcs.dto';
import { GetProviderVdcsParams } from 'src/wrappers/vcloud-wrapper/services/admin/vdc/dto/get-provider-vdcs.dto';
import { GetProviderVdcsMetadataDto } from './dto/get-provider-vdcs-metadata.dto';
import { VdcUnits } from 'src/application/vdc/enum/vdc-units.enum';

@Injectable()
export class AdminVdcWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly adminEdgeGatewayWrapperService: AdminEdgeGatewayWrapperService,
  ) {}
  /**
   * @param {Object} config config for creating vdc
   * @param {String} orgId
   * @param {String} config.ProviderVdcReference link to provider vdc
   * @param {String} config.VdcStorageProfile link to an storage policy
   * @param {String} config.NetworkPoolReference link to network pool
   * @param {Number} config.cores number of cores
   * @param {Number} config.ram ram in MB
   * @param {Number} config.storage hard disk capacity in GB
   * @param {String} config.name vdc name
   * @param {String} config.authToken vdc name
   * @param {String} config.vm number of vm
   * @param {Number} config.ResourceGuaranteedCpu
   * @param {Number} config.ResourceGuaranteedMemory
   * @return {Promise}
   */
  async createVdc(
    config: CreateVdcConfig,
    orgId: string,
  ): Promise<CreateVdcDto> {
    const vdcConfig = vcdConfig.admin.vdc;
    orgId = orgId.split(':').slice(-1)[0];
    const cores = config.cores;
    const vCpuInMhz = config.vCpuInMhz;
    const cpuLimit = cores * vCpuInMhz;
    const request = {
      name: config.name,
      description: null,
      isEnabled: vdcConfig.isEnabled,
      allocationModel: vdcConfig.AllocationModel,
      computeCapacity: {
        cpu: {
          ...vdcConfig.ComputeCapacity.Cpu,
          allocated: cpuLimit,
          limit: cpuLimit,
        },
        memory: {
          ...vdcConfig.ComputeCapacity.Memory,
          allocated: config.ram * 1024,
          limit: config.ram * 1024,
        },
      },
      includeMemoryOverhead: vdcConfig.includeMemoryOverhead,
      isElastic: false,
      vCpuInMhz: config.vCpuInMhz,
      resourceGuaranteedCpu: config.resourceGuaranteedCpu,
      resourceGuaranteedMemory: config.resourceGuaranteedMemory,
      providerVdcReference: {
        href: config.providerVdcReference.href,
        name: config.providerVdcReference.name,
      },
      vmQuota: config.vm,
      networkPoolReference: {
        name: config.networkPoolReference.name,
        href: config.networkPoolReference.href,
      },
      networkQuota: config.networkQuota,
      vdcStorageProfile: config.vdcStorageProfiles,
      isThinProvision: vdcConfig.isThinProvision,
      usesFastProvisioning: vdcConfig.usesFastProvisioning,
    };
    const options = {
      headers: { Authorization: `Bearer ${config.authToken}` },
      body: request,
      urlParams: { orgId },
    };
    const endpoint = 'AdminVdcEndpointService.createVdcEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const vdc: any = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      id: vdc.data.id,
      __vcloudTask: vdc.headers['location'],
    });
  }
  async deleteVdc(session: string, vdcId: string): Promise<AxiosResponse> {
    // convert from urn:vcloud:org:vdcId -> vdcId
    vdcId = vdcId.split(':').slice(-1)[0];

    const options = {
      headers: { Authorization: `Bearer ${session}` },
      urlParams: { vdcId: vdcId },
    };
    const endpoint = 'AdminVdcEndpointService.deleteVdcEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    return await this.vcloudWrapperService.request(wrapper(options));
  }
  async disableVdc(session: string, vdcId: string): Promise<AxiosResponse> {
    // convert from urn:vcloud:org:vdcId -> vdcId
    vdcId = vdcId.split(':').slice(-1)[0];

    const options = {
      headers: { Authorization: `Bearer ${session}` },
      urlParams: { vdcId: vdcId },
    };
    const endpoint = 'AdminVdcEndpointService.disableVdcEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    return await this.vcloudWrapperService.request(wrapper(options));
  }
  async enableVdc(vdcId: string, session: string): Promise<void> {
    // convert from urn:vcloud:org:vdcId -> vdcId
    vdcId = vdcId.split(':').slice(-1)[0];

    const options = {
      headers: { Authorization: `Bearer ${session}` },
      urlParams: { vdcId: vdcId },
    };
    const endpoint = 'AdminVdcEndpointService.enableVdcEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    await this.vcloudWrapperService.request(wrapper(options));
  }
  /**
   * @param {String} vdcId
   * @param {String} session
   */
  async updateNetworkProfile(
    vdcId: string,
    session: string,
  ): Promise<VcloudTask> {
    const edgeClusterId =
      await this.adminEdgeGatewayWrapperService.getEdgeCluster(vdcId, session);
    const options = {
      headers: { Authorization: `Bearer ${session}` },
      urlParams: { vdcId: vdcId },
      body: {
        primaryEdgeCluster: null,
        secondaryEdgeCluster: null,
        servicesEdgeCluster: {
          backingId: edgeClusterId,
        },
        vdcNetworkSegmentProfileTemplateRef: null,
        vappNetworkSegmentProfileTemplateRef: null,
      },
    };
    const endpoint = 'AdminVdcEndpointService.updateNetworkProfileEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const networkProfile = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return {
      __vcloudTask: networkProfile.headers.location,
    };
  }
  /**
   * @param {Object} config config for creating vdc
   * @param {String} vdcId
   * @param {Number} config.cores number of cores
   * @param {Number} config.ram ram in GB
   * @param {Number} config.prevRam ram in GB
   * @param {Number} config.prevCores ram in GB
   * @param {String} config.name vdc name
   * @param {String} config.authToken vdc name
   * @param {String} config.vm number of vm
   * @param {String} config.nicQuota number of vm
   * @param {String} config.networkQuota number of vm
   * @param {String} config.providerVdcReference number of vm
   * @return {void}
   */
  async updateVdc(
    config: UpdateVdcComputePolicyDto,
    vdcId: string,
  ): Promise<VcloudTask> {
    const vdcConfig = vcdConfig.admin.vdc;
    // convert from urn:vcloud:org:vdcId -> vdcId
    vdcId = vdcId.split(':').slice(-1)[0];
    const cores = config.cores;
    const vCpuInMhz: any = vdcConfig.VCpuInMhz;
    const cpuAllocation = cores * parseInt(vCpuInMhz);
    const cpuLimit = cpuAllocation;
    const request = {
      type: 'application/vnd.vmware.admin.vdc+json',
      id: vdcId,
      name: config.name,
      allocationModel: vdcConfig.AllocationModel,
      computeCapacity: {
        cpu: {
          units: VdcUnits.CpuUnit,
          allocated: cpuAllocation,
          limit: cpuLimit,
        },
        memory: {
          units: VdcUnits.RamUnit,
          allocated: config.ram * 1024,
          limit: config.ram * 1024,
        },
      },
      providerVdcReference: config.providerVdcReference,
      vmQuota: config.vm,
      nicQuota: config.nicQuota,
      networkQuota: config.networkQuota,
      resourceGuaranteedCpu: config.resourceGuaranteedCpu,
      resourceGuaranteedMemory: config.resourceGuaranteedMemory,
    };
    const options = {
      headers: { Authorization: `Bearer ${config.authToken}` },
      urlParams: { vdcId: vdcId },
      body: request,
    };
    const endpoint = 'AdminVdcEndpointService.updateVdcEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const updatedVdc = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return {
      __vcloudTask: updatedVdc.headers.location,
    };
  }
  async updateVdcStorageProfile(
    config: UpdateVdcStoragePolicyDto,
    vdcId: string,
  ): Promise<void> {
    const queryOptions = {
      headers: { Authorization: `Bearer ${config.authToken}` },
      params: {
        type: 'adminOrgVdcStorageProfile',
        page: 1,
        pageSize: 15,
        format: 'records',
        filter: `(vdc==${vdcId})`,
      },
    };
    const queryEndpoint = 'VdcEndpointService.vcloudQueryEndpoint';
    const queryWrapper =
      this.vcloudWrapperService.getWrapper<typeof queryEndpoint>(queryEndpoint);
    const storageProfile =
      await this.vcloudWrapperService.request<AdminOrgVdcStorageProfileQuery>(
        queryWrapper(queryOptions),
      );
    const storageProfileLink = storageProfile.data.record[0].href;
    const request = {
      name: config.name,
      default: config.default,
      units: config.units,
      limit: config.storage * 1024,
      enabled: true,
      providerVdcStorageProfile: config.providerVdcStorageProfile,
    };
    const options = {
      headers: { Authorization: `Bearer ${config.authToken}` },
      urlParams: {
        fullUrl: storageProfileLink,
      },
      body: request,
    };
    const endpoint = 'AdminVdcEndpointService.updateVdcStorageProfileEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    await this.vcloudWrapperService.request(wrapper(options));
    return;
  }

  async getProviderVdcs(
    authToken: string,
    params: GetProviderVdcsParams,
  ): Promise<GetProviderVdcsDto> {
    const endpoint = 'AdminVdcEndpointService.getProviderVdcsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const providerVdcsList =
      await this.vcloudWrapperService.request<GetProviderVdcsDto>(
        wrapper({
          params,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      );
    return providerVdcsList.data;
  }

  async getProviderVdcMetadata(
    authToken: string,
    providerVdcId: string,
  ): Promise<GetProviderVdcsMetadataDto> {
    const endpoint = 'AdminVdcEndpointService.getProviderVdcsMetaDataEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const formattedId = providerVdcId.split('providervdc:').slice(-1)[0];
    const providerVdcsList =
      await this.vcloudWrapperService.request<GetProviderVdcsMetadataDto>(
        wrapper({
          urlParams: {
            providerVdcId: formattedId,
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }),
      );
    return providerVdcsList.data;
  }
}
