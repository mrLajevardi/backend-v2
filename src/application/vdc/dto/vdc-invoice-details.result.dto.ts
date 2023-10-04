import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';
import { VdcInvoiceDetailsInfoResultDto } from './vdc-invoice-details-info.result.dto';

export class VdcInvoiceDetailsResultDto extends BaseResultDto {
  constructor() {
    super();
  }

  datacenter?: { name?: string; title?: string };
  cpu?: VdcInvoiceDetailsInfoResultDto;
  disk?: VdcInvoiceDetailsInfoResultDto[];
  ram?: VdcInvoiceDetailsInfoResultDto;
  vm?: VdcInvoiceDetailsInfoResultDto;
  ip?: VdcInvoiceDetailsInfoResultDto;
  guaranty?: string;
  period?: string;
  generation?: string;
  finalPrice?: string;
  reservationRam?: string;
  reservationCpu?: string;
}
