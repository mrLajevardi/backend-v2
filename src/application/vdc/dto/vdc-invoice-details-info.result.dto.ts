import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';
import { InvoiceDetailVdcModel } from '../../base/invoice/interface/invoice-detail-vdc.interface';

export class VdcInvoiceDetailsInfoResultDto extends BaseResultDto {
  constructor(item: InvoiceDetailVdcModel) {
    super();

    this.price = item?.fee ? item?.fee : item?.price;
    this.title = item?.title;
    this.unit = item?.unit;
    this.value = item?.value.toString();
    this.usage = 0;
    this.code = item?.code;
    this.priceWithTax = this.price + this.price * 0.09;
    this.tax = this.price * 0.09;
  }

  price: number;
  title: string;
  unit: string;
  value: string; // InvoiceItem
  usage: number;
  code: string;
  priceWithTax: number;
  tax?: number;
}
