import { CreateServiceInvoiceDto } from '../../dto/create-service-invoice.dto';
import { SessionRequest } from '../../../../../infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../../dto/invoice-id.dto';
import { InvoiceDetailBaseDto } from '../../../../vdc/dto/invoice-detail-base.dto';

export interface InvoiceBaseStrategyInterface {
  createInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto>;

  getInvoiceDetails(invoiceId: string): Promise<InvoiceDetailBaseDto>;
}
