export enum ItemTypeCodes {
  Generation = 'generation',
  Period = 'period',
  CpuReservation = 'reservation_cpu',
  MemoryReservation = 'reservation_ram',
  Guaranty = 'guaranty',
}

export enum VdcGenerationItemCodes {
  Cpu = 'cpu',
  Vm = 'vm',
  Ram = 'ram',
  disk = 'disk',
  Ip = 'ip',
}

export enum DiskItemCodes {
  Standard = 'standard',
  Archive = 'archive',
  Vip = 'vip',
  Fast = 'fast',
  Swap = 'swap',
}
