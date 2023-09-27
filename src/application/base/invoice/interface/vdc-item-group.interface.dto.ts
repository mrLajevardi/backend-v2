import { ServiceItemTypesTree } from 'src/infrastructure/database/entities/views/service-item-types-tree';
export interface InvoiceGroupItem extends ServiceItemTypesTree {
  value: string;
}
export interface VdcItemGroup {
  period: InvoiceGroupItem;
  cpuReservation: InvoiceGroupItem;
  memoryReservation: InvoiceGroupItem;
  generation: VdcGenerationItems;
}

export interface VdcGenerationItems {
  cpu: InvoiceGroupItem[];
  memory: InvoiceGroupItem[];
  disk: InvoiceGroupItem[];
  ip: InvoiceGroupItem[];
  vm: InvoiceGroupItem[];
}
