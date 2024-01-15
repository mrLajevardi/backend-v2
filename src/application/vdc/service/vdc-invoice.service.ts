import { BaseVdcInvoiceServiceInterface } from '../interface/service/base-vdc-invoice-service.interface';

import { Inject, Injectable } from '@nestjs/common';

import { VdcInvoiceDetailsResultDto } from '../dto/vdc-invoice-details.result.dto';
import {
  BASE_INVOICE_SERVICE,
  BaseInvoiceService,
} from '../../base/invoice/interface/service/invoice.interface';
import { InvoiceDetailBaseDto } from '../dto/invoice-detail-base.dto';
import { InvoiceItemList } from '../../../infrastructure/database/entities/views/invoice-item-list';
import { InvoiceItemListService } from '../../base/crud/invoice-item-list/invoice-item-list.service';
import { InvoiceVdcStrategyService } from '../../base/invoice/classes/invoice-vdc-strategy/invoice-vdc-strategy.service';

@Injectable()
export class VdcInvoiceService implements BaseVdcInvoiceServiceInterface {
  constructor(
    private readonly invoiceVdcStrategyService: InvoiceVdcStrategyService,
  ) {}

  getVdcPreFactor(
    invoiceId: string,
    serviceType: 'vdc',
  ): Promise<VdcInvoiceDetailsResultDto> {
    const res = this.getVdcInvoiceDetail(invoiceId, serviceType);
    console.log(res);

    return res;
  }
  getVdcInvoiceDetail(
    invoiceId: string,
    serviceType = 'vdc',
  ): Promise<VdcInvoiceDetailsResultDto> {
    if (!invoiceId) return Promise.resolve(new VdcInvoiceDetailsResultDto());

    const res = this.invoiceVdcStrategyService.getInvoiceDetails(invoiceId);

    return Promise.resolve(res);
  }
}
