import { vcdConfig } from '../../vcdConfig';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
import { IntegerType } from 'typeorm';
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
export async function updateVdc(config, vdcId) {
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
  await new VcloudWrapper().posts('admin.vdc.updateVdc', options);
}