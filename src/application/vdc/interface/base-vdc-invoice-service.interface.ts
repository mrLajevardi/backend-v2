import { IBaseService } from '../../../infrastructure/service/IBaseService';
import { VdcInvoiceDetailsResultDto } from '../dto/vdc-invoice-details.result.dto';

export const BASE_VDC_INVOICE_SERVICE = 'BASE_VDC_INVOICE_SERVICE';
export interface BaseVdcInvoiceServiceInterface extends IBaseService {
  getVdcInvoiceDetail(invoiceId: string): Promise<VdcInvoiceDetailsResultDto>;
}
