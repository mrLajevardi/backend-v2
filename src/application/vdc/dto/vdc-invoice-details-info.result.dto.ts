import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';
import { InvoiceDetailVdcModel } from '../../base/invoice/interface/invoice-detail-vdc.interface';

export class VdcInvoiceDetailsInfoResultDto extends BaseResultDto {
  constructor(item: InvoiceDetailVdcModel) {
    super();

    this.price = Math.round(item.fee ? item.fee : item.price);
    this.title = item.title;
    this.unit = item.unit;
    this.value = item.value.toString();
    this.usage = 0;
    this.code = item.code;
  }

  price: number; // InvoiceItem
  title: string; //  Tree => Code
  unit: string; //  ? Static
  value: string; // InvoiceItem
  usage: number;
  code: string;
}
