import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../../dto/invoice-id.dto';
import { CreateServiceInvoiceDto } from '../../dto/create-service-invoice.dto';
import { VdcInvoiceDetailsResultDto } from '../../../../vdc/dto/vdc-invoice-details.result.dto';
import {
  VdcInvoiceCalculatorDto,
  VdcInvoiceCalculatorResultDto,
} from '../../dto/vdc-invoice-calculator.dto';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { UpgradeAndExtendDto } from '../../dto/upgrade-and-extend.dto';
import { ServiceTypesEnum } from '../../../service/enum/service-types.enum';

export const BASE_INVOICE_SERVICE = 'BASE_INVOICE_SERVICE';

export interface BaseInvoiceService {
  createServiceInvoice(
    serviceType: ServiceTypesEnum,
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto>;

  createAiInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto>;

  createVdcInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto>;

  getVdcInvoiceDetails(
    invoiceId: string,
    serviceType: string,
  ): Promise<VdcInvoiceDetailsResultDto>;

  vdcInvoiceCalculator(
    dto: VdcInvoiceCalculatorDto,
  ): Promise<VdcInvoiceCalculatorResultDto>;

  getTransaction(
    options: SessionRequest,
    authorityCode: string,
  ): Promise<Transactions>;

  upgradeAndExtendInvoice(
    invoice: UpgradeAndExtendDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto>;
}
