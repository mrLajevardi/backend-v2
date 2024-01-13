import { InvoiceBaseStrategyInterface } from './invoice-base-strategy.interface';
import {
  InvoiceCalculatorDto,
  InvoiceCalculatorResultDto,
} from '../../dto/invoice-calculator.dto';
import { UpgradeAndExtendDto } from '../../dto/upgrade-and-extend.dto';
import { SessionRequest } from '../../../../../infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../../dto/invoice-id.dto';

export interface InvoiceVdcStrategyInterface
  extends InvoiceBaseStrategyInterface {
  invoiceCalculator(
    dto: InvoiceCalculatorDto,
  ): Promise<InvoiceCalculatorResultDto>;

  upgradeAndExtendInvoice(
    invoice: UpgradeAndExtendDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto>;
}
