import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';
import { VdcInvoiceDetailsInfoResultDto } from './vdc-invoice-details-info.result.dto';
import { GuarantyCode } from '../../base/itemType/enum/item-type-codes.enum';

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
  guaranty?: VdcInvoiceDetailsInfoResultDto;
  period?: VdcInvoiceDetailsInfoResultDto;
  generation?: string;
  finalPrice?: number;
  reservationRam?: string;
  reservationCpu?: string;
  rawAmount?: number;
  templateId?: string;
}
