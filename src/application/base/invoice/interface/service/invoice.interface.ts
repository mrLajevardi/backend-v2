import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../../dto/invoice-id.dto';
import { CreateServiceInvoiceDto } from '../../dto/create-service-invoice.dto';
import { VdcInvoiceDetailsResultDto } from '../../../../vdc/dto/vdc-invoice-details.result.dto';
import {
  VdcInvoiceCalculatorDto,
  VdcInvoiceCalculatorResultDto,
} from '../../dto/vdc-invoice-calculator.dto';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';

export const BASE_INVOICE_SERVICE = 'BASE_INVOICE_SERVICE';

export interface BaseInvoiceService {
  createVdcInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto>;

  getVdcInvoiceDetails(invoiceId: string): Promise<VdcInvoiceDetailsResultDto>;

  vdcInvoiceCalculator(
    dto: VdcInvoiceCalculatorDto,
  ): Promise<VdcInvoiceCalculatorResultDto>;

  getTransaction(
    options: SessionRequest,
    authorityCode: string,
  ): Promise<Transactions>;
}
