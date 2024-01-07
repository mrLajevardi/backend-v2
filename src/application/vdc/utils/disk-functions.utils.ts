import { DiskItemCodes } from '../../base/itemType/enum/item-type-codes.enum';
import { VmService } from '../../vm/service/vm.service';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { DiskCalcSwapStorageModel } from '../dto/disk-calc-swapstorage.model';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const GetCodeDisk = (diskTitle: string) => {
  const itemsDiskCodes = Object.keys(DiskItemCodes);
  let diskCode = '';

  itemsDiskCodes.forEach((item) => {
    if (diskTitle.trim().toLowerCase().includes(item.trim().toLowerCase())) {
      diskCode = item.toLowerCase();
    }
  });
  return diskCode;
};

export const CalcSwapStorageVdc = async (
  model: DiskCalcSwapStorageModel,
  vmService: VmService,
  option: SessionRequest,
) => {
  const allVdcVms = await vmService.getAllUserVm(
    option,
    model.serviceInstanceId,
  );
  let limit = 0;
  let used = 0;
  let allVmStorages = 0;
  let allVmMemories = 0;
  const countVm = allVdcVms.total;

  const swapStorageLimit = model.numberOfVms * model.memoryAllocation;

  // allVdcVms.values.forEach((vm) => (allVmStorages += vm.storage - vm.memory));
  allVdcVms.values.forEach((vm) => {
    allVmStorages += vm.storage;
    allVmMemories += vm.memory;
  });
  // (used = model.storageUsed - allMemoryVms),
  const swapStorageUsed = allVmMemories * countVm;

  (used = model.storageUsed - swapStorageUsed),
    (limit = model.storageLimit - swapStorageLimit);
  return { used, limit };
};

export const CalcSwapStorageDisk = async (
  model: DiskCalcSwapStorageModel,
  vmService: VmService,
  option: SessionRequest,
) => {
  const allVdcVms = await vmService.getAllUserVm(
    option,
    model.serviceInstanceId,
  );
  let limit = 0;
  let used = 0;
  let allVmStorages = 0;

  const swapStorage = model.numberOfVms * model.memoryAllocation;

  // allVdcVms.values.forEach((vm) => (allVmStorages += vm.storage - vm.memory));
  allVdcVms.values.forEach((vm) => (allVmStorages += vm.storage));
  // (used = model.storageUsed - allMemoryVms),
  (used = model.storageUsed - swapStorage),
    (limit = model.storageLimit - swapStorage);
  return { used, limit };
};
