export enum ItemTypeCodes {
  Generation = 'generation',
  Period = 'period',
  CpuReservation = 'reservationCpu',
  MemoryReservation = 'reservationRam',
  Guaranty = 'guaranty',
}

export enum VdcGenerationItemCodes {
  Cpu = 'cpu',
  Vm = 'vm',
  Ram = 'ram',
  Disk = 'disk',
  Ip = 'ip',
}

export enum DiskItemCodes {
  Standard = 'standard',
  Archive = 'archive',
  Vip = 'vip',
  Fast = 'fast',
  Swap = 'swap',
}
