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

export const CalcSwapStorage = async (
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

  // allVdcVms.values.forEach((vm) => (allVmStorages += vm.storage - vm.memory));
  allVdcVms.values.forEach((vm) => (allVmStorages += vm.storage));
  // (used = model.storageUsed - allMemoryVms),
  (used = allVmStorages),
    (limit = model.storageLimit - model.numberOfVms * model.memoryAllocation);
  return { used, limit };
};
