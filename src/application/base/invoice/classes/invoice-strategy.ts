import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../dto/invoice-id.dto';
import { InvoiceDetailBaseDto } from '../../../vdc/dto/invoice-detail-base.dto';
import { InvoiceBaseStrategyInterface } from './interface/invoice-base-strategy.interface';
import {
  InvoiceCalculatorDto,
  InvoiceCalculatorResultDto,
} from '../dto/invoice-calculator.dto';
import { InvoiceVdcStrategyService } from './invoice-vdc-strategy/invoice-vdc-strategy.service';
import { BadRequestException } from '../../../../infrastructure/exceptions/bad-request.exception';
import { UpgradeAndExtendDto } from '../dto/upgrade-and-extend.dto';

export class InvoiceStrategy {
  private strategy: InvoiceBaseStrategyInterface;

  public setStrategy(strategy: InvoiceBaseStrategyInterface) {
    this.strategy = strategy;
  }

  async create(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    return await this.strategy.createInvoice(dto, options);
  }

  async getDetails(invoiceId: string): Promise<InvoiceDetailBaseDto> {
    return this.strategy.getInvoiceDetails(invoiceId);
  }

  async invoiceCalculator(
    dto: InvoiceCalculatorDto,
  ): Promise<InvoiceCalculatorResultDto> {
    if (this.strategy instanceof InvoiceVdcStrategyService) {
      return await this.strategy.invoiceCalculator(dto);
    } else {
      throw new BadRequestException();
    }
  }

  async upgradeAndExtendInvoice(
    invoice: UpgradeAndExtendDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    if (this.strategy instanceof InvoiceVdcStrategyService) {
      return await this.strategy.upgradeAndExtendInvoice(invoice, options);
    } else {
      throw new BadRequestException();
    }
  }
}
