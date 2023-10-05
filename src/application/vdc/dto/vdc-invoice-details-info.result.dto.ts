import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';
import { InvoiceDetailVdcModel } from '../../base/invoice/interface/invoice-detail-vdc.interface';

export class VdcInvoiceDetailsInfoResultDto extends BaseResultDto {
  constructor(item: InvoiceDetailVdcModel) {
    super();

    this.price = item.fee;
    this.title = item.title;
    this.unit = item.unit;
    this.value = item.value.toString();
    this.code = item.code;
  }

  price: number; // InvoiceItem
  title: string; //  Tree => Code
  unit: string; //  ? Static
  value: string; // InvoiceItem
  code: string;
}
