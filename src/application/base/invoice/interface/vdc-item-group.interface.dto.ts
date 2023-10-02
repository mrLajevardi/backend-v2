import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
export interface InvoiceGroupItem extends ServiceItemTypesTree {
  value: string;
}
export interface VdcItemGroup {
  period: InvoiceGroupItem;
  cpuReservation: InvoiceGroupItem;
  memoryReservation: InvoiceGroupItem;
  generation: VdcGenerationItems;
  guaranty: InvoiceGroupItem;
}

export class VdcGenerationItems {
  cpu: InvoiceGroupItem[];
  ram: InvoiceGroupItem[];
  disk: InvoiceGroupItem[];
  ip: InvoiceGroupItem[];
  vm: InvoiceGroupItem[];

  constructor() {
    this.cpu = [];
    this.ram = [];
    this.disk = [];
    this.ip = [];
    this.vm = [];
  }
}
