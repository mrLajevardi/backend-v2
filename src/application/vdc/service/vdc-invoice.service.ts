import { BaseVdcInvoiceServiceInterface } from '../interface/service/base-vdc-invoice-service.interface';

import { Inject, Injectable } from '@nestjs/common';

import { VdcInvoiceDetailsResultDto } from '../dto/vdc-invoice-details.result.dto';
import {
  BASE_INVOICE_SERVICE,
  BaseInvoiceService,
} from '../../base/invoice/interface/service/invoice.interface';

@Injectable()
export class VdcInvoiceService implements BaseVdcInvoiceServiceInterface {
  constructor(
    @Inject(BASE_INVOICE_SERVICE)
    private readonly invoiceVdcService: BaseInvoiceService,
  ) {}
  getVdcInvoiceDetail(invoiceId: string): Promise<VdcInvoiceDetailsResultDto> {
    const res = this.invoiceVdcService.getVdcInvoiceDetails(invoiceId);
    return Promise.resolve(res);
  }
}
