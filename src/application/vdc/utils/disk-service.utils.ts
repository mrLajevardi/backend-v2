import { Injectable } from '@nestjs/common';
import { VmService } from '../../vm/service/vm.service';
import { GetOrgVdcResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';

@Injectable()
export class DiskServiceUtils {
  // constructor(private readonly vmService: VmService) {}

  async CalcSwapStorage(
    storageUsed: number,
    storageLimit: number,
    memoryAllocation: number,
    vmService: VmService,
    serviceInstanceId: string,
    option: SessionRequest,
  ) {
    const allVms = await vmService.getAllUserVm(option, serviceInstanceId);
    let limit = 0;
    let used = 0;
    let allMemoryVms = 0;

    allVms.values.forEach((vm) => (allMemoryVms += vm.memory));
    (used = storageUsed - allMemoryVms),
      (limit = storageLimit - allVms.values.length * memoryAllocation);
    return { used, limit };
  }
}
