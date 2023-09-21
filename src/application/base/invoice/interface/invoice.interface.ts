import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../dto/invoice-id.dto';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';

export interface BaseInvoiceService {
  createVdcInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto>;
}
