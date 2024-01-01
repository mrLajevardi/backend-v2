import { InvoiceDetailVdcModel } from '../../base/invoice/interface/invoice-detail-vdc.interface';

export interface VdcModel extends InvoiceDetailVdcModel {
  value?: string;
  itemID?: number;
  codeHierarchy?: string;
  parentCode?: string;
  datacenterName?: string;
  code?: string;
  title?: string;
  unit?: string;
  serviceName?: string;
  status?: number;
  daysLeft?: number;
  servicePlanType?: number;
}
