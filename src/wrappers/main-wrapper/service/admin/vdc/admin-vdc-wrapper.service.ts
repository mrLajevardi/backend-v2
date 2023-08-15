import { Injectable } from '@nestjs/common';
import { vcdConfig } from 'src/wrappers/main-wrapper/vcdConfig';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { AdminEdgeGatewayWrapperService } from '../edgeGateway/admin-edge-gateway-wrapper.service';

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
  async createVdc(config, orgId) {
    const vdcConfig = vcdConfig.admin.vdc;
    orgId = orgId.split(':').slice(-1);
    const cores = config.cores;
    const vCpuInMhz = config.vCpuInMhz;
    const cpuLimit = parseInt(cores) * parseInt(vCpuInMhz);
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
      includeMemoryOverhead: false,
      //usesFastProvisioning: false,
      //isThinProvision: false,
      isElastic: false,
      vCpuInMhz: config.vCpuInMhz,
      resourceGuaranteedCpu: config.ResourceGuaranteedCpu,
      resourceGuaranteedMemory: config.ResourceGuaranteedMemory,
      providerVdcReference: {
        href: config.ProviderVdcReference.href,
        name: config.ProviderVdcReference.name,
      },
      vmQuota: config.vm,
      networkPoolReference: {
        name: config.NetworkPoolReference.name,
        href: config.NetworkPoolReference.href,
      },
      networkQuota: config.NetworkQuota,
      vdcStorageProfile: [
        {
          ...vdcConfig.VdcStorageProfileParams,
          limit: config.storage * 1024,
          providerVdcStorageProfile: {
            href: config.VdcStorageProfileParams.providerVdcStorageProfile.href,
            name: config.VdcStorageProfileParams.providerVdcStorageProfile.name,
          },
        },
      ],
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
  /**
   * @param {String} session
   * @param {String} vdcId
   * @return {void}
   */
  async deleteVdc(session, vdcId) {
    // convert from urn:vcloud:org:vdcId -> vdcId
    vdcId = vdcId.split(':').slice(-1);

    const options = {
      headers: { Authorization: `Bearer ${session}` },
      urlParams: { vdcId: vdcId },
    };
    const endpoint = 'AdminVdcEndpointService.deleteVdcEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    return await this.vcloudWrapperService.request(wrapper(options));
  }
  /**
   * @param {String} session
   * @param {String} vdcId
   * @return {void}
   */
  async disableVdc(session, vdcId) {
    // convert from urn:vcloud:org:vdcId -> vdcId
    vdcId = vdcId.split(':').slice(-1);

    const options = {
      headers: { Authorization: `Bearer ${session}` },
      urlParams: { vdcId: vdcId },
    };
    const endpoint = 'AdminVdcEndpointService.disableVdcEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    return await this.vcloudWrapperService.request(wrapper(options));
  }
  /**

   * @param {String} vdcId
   */
  async enableVdc(vdcId, session) {
    // convert from urn:vcloud:org:vdcId -> vdcId
    vdcId = vdcId.split(':').slice(-1);

    const options = {
      headers: { Authorization: `Bearer ${session}` },
      urlParams: { vdcId: vdcId },
      body: null,
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
  async updateNetworkProfile(vdcId, session) {
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
  async updateVdc(config, vdcId) {
    const vdcConfig = vcdConfig.admin.vdc;
    // convert from urn:vcloud:org:vdcId -> vdcId
    vdcId = vdcId.split(':').slice(-1);
    const cores = config.cores;
    const vCpuInMhz: any = vdcConfig.VCpuInMhz;
    const cpuAllocation = parseInt(cores) * parseInt(vCpuInMhz);
    const cpuLimit = parseInt(config.prevCores) * parseInt(vCpuInMhz);
    const request = {
      type: 'application/vnd.vmware.admin.vdc+json',
      id: vdcId,
      name: config.name,
      allocationModel: vdcConfig.AllocationModel,
      computeCapacity: {
        cpu: {
          ...vdcConfig.ComputeCapacity.Cpu,
          allocated: cpuAllocation,
          limit: cpuLimit,
        },
        memory: {
          ...vdcConfig.ComputeCapacity.Memory,
          allocated: config.ram * 1024,
          limit: config.prevRam * 1024,
        },
      },
      providerVdcReference: config.providerVdcReference,
      vmQuota: config.vm,
      nicQuota: config.nicQuota,
      networkQuota: config.networkQuota,
    };
    const options = {
      headers: { Authorization: `Bearer ${config.authToken}` },
      urlParams: { vdcId: vdcId },
      body: request,
    };
    const endpoint = 'AdminVdcEndpointService.updateVdcEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    await this.vcloudWrapperService.request(wrapper(options));
  }
  /**
   * @param {Object} config config for updating vdc
   * @param {String} vdcId
   * @param {Object} config.providerVdcStorageProfile link to an storage policy
   * @param {String} config.name name of storage profile
   * @param {Number} config.storage hard disk capacity
   * @param {Boolean} config.default if storage profile is default or not
   * @param {String} config.units unit of hard disk eg: GB, MB
   * @param {String} config.authToken provider auth token
   * @return {Promise}
   */
  async updateVdcStorageProfile(config, vdcId) {
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
    const storageProfile: any = await this.vcloudWrapperService.request(
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
      fullUrl: storageProfileLink,
      body: request,
    };
    const endpoint = 'AdminVdcEndpointService.updateVdcStorageProfileEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const updatedVdc = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve(updatedVdc.data);
  }
}
