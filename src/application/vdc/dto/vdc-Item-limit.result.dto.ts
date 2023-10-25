import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';

export class VdcItemLimitResultDto extends BaseResultDto {
  constructor(cpuInfo: CpuInfo, maxRam: number, diskType: string[]) {
    super();
    this.cpuInfo = cpuInfo;
    this.maxRam = maxRam;
    this.diskType = diskType;
  }
  cpuInfo?: CpuInfo;
  maxRam?: number;
  diskType?: string[];
}
export class CpuInfo {
  maxCpuCores?: number;
  cpuCoreCountable?: number[];
}
