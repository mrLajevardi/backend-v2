import { getHardwareInfoEndpoint } from './getHardwareInfoEndpoint';
import { getVdcComputePolicyEndpoint } from './getVdcComputePolicyEndpoint';
import { vcloudQueryEndpoint } from './vcloudQueryEndpoint';
import { createNamedDisk } from './createNamedDisk';
import { removeNamedDisk } from './removeNamedDisk';
import { updateNamedDisk } from './updateNamedDisk';
import { attachNamedDisk } from './attachNamedDisk';
import { dettachNamedDisk } from './dettachNamedDisk';
import { vmAttachedNamedDisk } from './getVmAttachedNamedDisk';

export const vdcEndpoints = {
  getHardwareInfo: getHardwareInfoEndpoint,
  getVdcComputePolicy: getVdcComputePolicyEndpoint,
  vcloudQuery: vcloudQueryEndpoint,
  createNamedDisk: createNamedDisk,
  removeNamedDisk: removeNamedDisk,
  updateNamedDisk: updateNamedDisk,
  attachNamedDisk: attachNamedDisk,
  dettachNamedDisk: dettachNamedDisk,
  vmAttachedNamedDisk: vmAttachedNamedDisk,
};
