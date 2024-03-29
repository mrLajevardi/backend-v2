import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';
import { VdcInvoiceDetailsInfoResultDto } from './vdc-invoice-details-info.result.dto';
import { GuarantyCode } from '../../base/itemType/enum/item-type-codes.enum';
import { InvoiceDetailBaseDto } from './invoice-detail-base.dto';

export class VdcInvoiceDetailsResultDto extends InvoiceDetailBaseDto {
  constructor() {
    super();
    this.period = new VdcInvoiceDetailsInfoResultDto({});
    this.disk = [];
    this.ram = new VdcInvoiceDetailsInfoResultDto({});
    this.vm = new VdcInvoiceDetailsInfoResultDto({});
    this.ip = new VdcInvoiceDetailsInfoResultDto({});
    this.ip = new VdcInvoiceDetailsInfoResultDto({});
    this.guaranty = new VdcInvoiceDetailsInfoResultDto({});
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
  // finalPrice?: number;
  // finalPriceWithTax?: number;
  // finalPriceTax?: number;
  reservationRam?: string;
  reservationCpu?: string;
  // rawAmount?: number;
  // rawAmountWithTax?: number;
  // rawAmountTax?: number;
  // templateId?: string;
  // baseAmount?: number;
  // serviceCost?: number;
  // serviceCostTax?: number;
  // invoiceCode?: number;
  // serviceCostWithTax?: number;
  // invoiceTax?: number;
  // serviceCostWithDiscount?: number;
  // discountAmount?: number;
  // serviceCostFinal?: number;
}
