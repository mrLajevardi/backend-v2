import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';

export class VdcItemLimitResultDto extends BaseResultDto {
  constructor(
    cpuInfo: ItemLimitInfo,
    ramInfo: ItemLimitInfo,
    diskType: DiskTypeItemLimitInfo[],
  ) {
    super();
    this.cpuInfo = cpuInfo;
    this.ramInfo = ramInfo;
    this.diskInfo = diskType;
  }
  cpuInfo?: ItemLimitInfo;
  ramInfo?: ItemLimitInfo;
  diskInfo?: DiskTypeItemLimitInfo[];
}
export class ItemLimitInfo {
  max?: number;
  unit?: string;
  maxUsableWithOnVMs?: number;
  maxUsableWithOffVMs?: number;
  maxUsableWithOffAndOnVMs?: number;
}

export class DiskTypeItemLimitInfo {
  name?: string;
  id?: string;
  max?: number;
}
