import { userGetHardwareInfo } from './getHardwareInfo';
import { userGetVdcComputePolicy } from './getVdcComputePolicy';
import { vcloudQuery } from './vcloudQuery';
import { userCreateNamedDisk } from './createNamedDisk';
import { userGetNamedDisk } from './getNamedDisk';
import { userRemoveNamedDisk } from './removeNamedDisk';
import { userUpdateNamedDisk } from './updateNamedDisk';
import { userAttachNamedDisk } from './attachNamedDisk';
import { userDettachNamedDisk } from './dettachNamedDisk';
import { userGetVmAttachedNamedDisk } from './getVmAttachedNamedDisk';

export const vdcWrapper = {
  vcloudQuery: vcloudQuery,
  getVdcComputePolicy: userGetVdcComputePolicy,
  getHardwareInfo: userGetHardwareInfo,
  createNamedDisk: userCreateNamedDisk,
  getNamedDisk: userGetNamedDisk,
  removeNamedDisk: userRemoveNamedDisk,
  updateNamedDisk: userUpdateNamedDisk,
  attachNamedDisk: userAttachNamedDisk,
  dettachNamedDisk: userDettachNamedDisk,
  getVmAttachedNamedDisk: userGetVmAttachedNamedDisk,
};

