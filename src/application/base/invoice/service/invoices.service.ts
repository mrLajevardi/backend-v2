import { Injectable } from '@nestjs/common';
import { CostCalculationService } from './cost-calculation.service';
import { addMonths } from 'src/infrastructure/helpers/date-time.helper';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { CreateInvoicesDto } from '../../crud/invoices-table/dto/create-invoices.dto';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../dto/invoice-id.dto';
import { InvoiceValidationService } from '../validators/invoice-validation.service';
import { InvoiceFactoryService } from './invoice-factory.service';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly validationService: InvoiceValidationService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly invoicesTable: InvoicesTableService,
    private readonly costCalculationService: CostCalculationService,
    private readonly transactionTable: TransactionsTableService,
  ) {}

  async createVdcInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    await this.validationService.vdcInvoiceValidator(dto);
    if (dto.servicePlanTypes === ServicePlanTypeEnum.Static) {
      return this.createVdcStaticInvoice(
        dto,
        options,
        dto.serviceInstanceId || null,
      );
    }
    // return InvoiceIdDto.generateMock();
  }

  async createVdcStaticInvoice(
    data: CreateServiceInvoiceDto,
    options: SessionRequest,
    serviceInstanceId: string | null,
  ): Promise<InvoiceIdDto> {
    const userId = options.user.userId;
    const invoiceCost =
      await this.costCalculationService.calculateVdcStaticTypeInvoice(data);
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      data.itemsTypes,
    );
    const dto: CreateInvoicesDto = {
      userId,
      servicePlanType: data.servicePlanTypes,
      rawAmount: invoiceCost.totalCost,
      finalAmount: invoiceCost.totalCost,
      type: data.type,
      endDateTime: addMonths(new Date(), parseInt(groupedItems.period.value)),
      dateTime: new Date(),
      serviceTypeId: groupedItems.generation.ip[0].serviceTypeId,
      name: 'invoice' + Math.floor(Math.random() * 100),
      planAmount: 0,
      planRatio: 0,
      payed: false,
      voided: false,
      serviceInstanceId,
      description: '',
    };
    const invoice = await this.invoicesTable.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      invoice.id,
      invoiceCost.itemsSum,
    );
    await this.transactionTable.create({
      userId: userId.toString(),
      dateTime: new Date(),
      paymentType: 0,
      paymentToken: '-',
      isApproved: false,
      value: invoiceCost.totalCost,
      invoiceId: invoice.id,
      description: 'vdc',
      serviceInstanceId,
    });
    return { invoiceId: invoice.id };
  }
}
