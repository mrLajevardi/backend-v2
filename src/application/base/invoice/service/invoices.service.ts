import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CostCalculationService } from './cost-calculation.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../dto/invoice-id.dto';
import { InvoiceValidationService } from '../validators/invoice-validation.service';
import { BaseInvoiceService } from '../interface/service/invoice.interface';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { FindManyOptions } from 'typeorm';
import { Invoices } from '../../../../infrastructure/database/entities/Invoices';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';
import { InvoiceVdcStrategyService } from '../classes/invoice-vdc-strategy/invoice-vdc-strategy.service';
import { InvoiceAiStrategyService } from '../classes/invoice-ai-strategy/invoice-ai-strategy.service';
import { InvoiceStrategy } from '../classes/invoice-strategy';
import {
  InvoiceCalculatorDto,
  InvoiceCalculatorResultDto,
} from '../dto/invoice-calculator.dto';
import { UpgradeAndExtendDto } from '../dto/upgrade-and-extend.dto';
import { isEmpty } from '../../../../infrastructure/helpers/helpers';
import { InvoiceDetailBaseDto } from '../../../vdc/dto/invoice-detail-base.dto';
import { ForbiddenException } from '../../../../infrastructure/exceptions/forbidden.exception';

@Injectable()
export class InvoicesService implements BaseInvoiceService {
  constructor(
    private readonly validationService: InvoiceValidationService,
    private readonly invoicesTable: InvoicesTableService,
    private readonly transactionTable: TransactionsTableService,
    private readonly invoiceVdcStrategyService: InvoiceVdcStrategyService,
    private readonly invoiceAiStrategyService: InvoiceAiStrategyService,
    private readonly invoiceStrategy: InvoiceStrategy,
  ) {}

  private dictionary: object = {
    [ServiceTypesEnum.Vdc]: this.invoiceVdcStrategyService,
    [ServiceTypesEnum.Ai]: this.invoiceAiStrategyService,
  };

  async createServiceInvoice(
    serviceType: ServiceTypesEnum,
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    await this.validationService.invoiceValidator(serviceType, dto);

    this.invoiceStrategy.setStrategy(this.dictionary[serviceType]);

    return await this.invoiceStrategy.create(dto, options);
  }

  async getDetails(
    invoiceId: string,
    preFactor = false,
    options: SessionRequest,
  ): Promise<InvoiceDetailBaseDto | ForbiddenException> {
    const invoice = await this.invoicesTable.findById(Number(invoiceId));

    if (isEmpty(invoice)) return new InvoiceDetailBaseDto();

    if (invoice.userId != options.user.userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    this.invoiceStrategy.setStrategy(this.dictionary[invoice.serviceTypeId]);

    if (preFactor) {
      await this.invoicesTable.update(invoice.id, {
        isPreInvoice: true,
      });
    }

    return await this.invoiceStrategy.getDetails(invoiceId);
  }

  async invoiceCalculator(
    dto: InvoiceCalculatorDto,
  ): Promise<InvoiceCalculatorResultDto> {
    this.invoiceStrategy.setStrategy(this.dictionary[dto.serviceType]);

    return await this.invoiceStrategy.invoiceCalculator(dto);
  }

  async upgradeAndExtendInvoice(
    invoice: UpgradeAndExtendDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    this.invoiceStrategy.setStrategy(this.dictionary[invoice.serviceType]);

    return await this.invoiceStrategy.upgradeAndExtendInvoice(invoice, options);
  }

  async getTransaction(
    options: SessionRequest,
    authorityCode: string,
  ): Promise<Transactions> {
    return this.transactionTable.findOne({
      where: {
        paymentToken: authorityCode,
        // invoiceId: Not(IsNull()),
        userId: options.user.userId,
      },
    });
  }

  // async getAll(option: FindManyOptions<Invoices>) {
  //     return await this.invoicesTable.find(option);
  // }
}
