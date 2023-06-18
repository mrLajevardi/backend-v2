const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const vCloudConfig = require('../../vcdConfig');

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
export async function createVdc(config, orgId) {
  const vdcConfig = vCloudConfig.admin.vdc;
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
    vdcStorageProfile: [{
      ...vdcConfig.VdcStorageProfileParams,
      limit: config.storage * 1024,
      providerVdcStorageProfile: {
        href: config.VdcStorageProfileParams.providerVdcStorageProfile.href,
        name: config.VdcStorageProfileParams.providerVdcStorageProfile.name,
      },
    }],
    isThinProvision: vdcConfig.isThinProvision,
    usesFastProvisioning: vdcConfig.usesFastProvisioning,
  };
  const options = {
    headers: {Authorization: `Bearer ${config.authToken}`},
    body: request,
    urlParams: {orgId},
  };
  const vdc = await new VcloudWrapper().posts('admin.vdc.createVdc', options);
  return Promise.resolve({
    id: vdc.data.id,
    __vcloudTask: vdc.headers['location'],
  });
}

module.exports = createVdc;
