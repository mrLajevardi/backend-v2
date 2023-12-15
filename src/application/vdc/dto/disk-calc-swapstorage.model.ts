import { BaseQueryDto } from '../../../infrastructure/dto/base.query.dto';
import { VmService } from '../../vm/service/vm.service';

export class DiskCalcSwapStorageModel extends BaseQueryDto {
  storageUsed: number;
  storageLimit: number;
  memoryAllocation: number;
  serviceInstanceId: string;
}
