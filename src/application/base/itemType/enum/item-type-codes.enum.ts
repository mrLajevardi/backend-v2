export enum ItemTypeCodes {
  Generation = 'generation',
  Period = 'period',
  CpuReservation = 'reservationCpu',
  MemoryReservation = 'reservationRam',
  Guaranty = 'guaranty',
  CpuReservationItem = 'reservationPercentCpu',
  MemoryReservationItem = 'reservationPercentRam',
  GuarantyItem = 'guarantyItem',
  PeriodItem = 'periodItem',
  RequestNumber = 'requestNumber',
}

export enum VdcGenerationItemCodes {
  Cpu = 'cpu',
  Vm = 'vm',
  Ram = 'ram',
  Disk = 'disk',
  Ip = 'ip',
}

export enum VdcGenerationItemUnit {
  Cpu = 'core',
  Ram = 'gb',
  Disk = 'gb',
}

export enum DiskItemCodes {
  Standard = 'standard',
  Archive = 'archive',
  Vip = 'vip',
  Fast = 'fast',
  Swap = 'swap',
}
export enum DiskItemName {
  Standard = 'استاندارد',
  Archive = 'آرشیو',
  Vip = 'ویژه',
  Fast = 'سریع',
  // Swap = 'swap',
}

//TODO Convert to English
export enum GuarantyCode {
  Vip = 'حرفه ای ',
  Base = 'پایه',
  Practical = 'کاربردی',
}

export enum ItemTypeUnits {
  PeriodItem = 'Month',
  CpuReservation = '%',
  MemoryReservation = '%',
  VmItem = 'VM',
  Ip = 'IP',
  Cpu = 'Cores',
  Ram = 'GB',
  Disk = 'GB',
}
