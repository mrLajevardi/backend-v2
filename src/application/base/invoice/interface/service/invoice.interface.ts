import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../../dto/invoice-id.dto';
import { CreateServiceInvoiceDto } from '../../dto/create-service-invoice.dto';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { ServiceTypesEnum } from '../../../service/enum/service-types.enum';
import { InvoiceDetailBaseDto } from '../../../../vdc/dto/invoice-detail-base.dto';
import {
  InvoiceCalculatorDto,
  InvoiceCalculatorResultDto,
} from '../../dto/invoice-calculator.dto';
import { UpgradeAndExtendDto } from '../../dto/upgrade-and-extend.dto';

export const BASE_INVOICE_SERVICE = 'BASE_INVOICE_SERVICE';

export interface BaseInvoiceService {
  createServiceInvoice(
    serviceType: ServiceTypesEnum,
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto>;

  getDetails(
    invoiceId: string,
    preFactor: boolean,
  ): Promise<InvoiceDetailBaseDto>;

  invoiceCalculator(
    dto: InvoiceCalculatorDto,
  ): Promise<InvoiceCalculatorResultDto>;

  getTransaction(
    options: SessionRequest,
    authorityCode: string,
  ): Promise<Transactions>;

  upgradeAndExtendInvoice(
    invoice: UpgradeAndExtendDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto>;
}
