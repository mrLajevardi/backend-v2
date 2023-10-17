import { Injectable } from '@nestjs/common';
import { CostCalculationService } from './cost-calculation.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../dto/invoice-id.dto';

import { InvoiceValidationService } from '../validators/invoice-validation.service';
import { InvoiceFactoryService } from './invoice-factory.service';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';

import { BaseInvoiceService } from '../interface/service/invoice.interface';
import { VdcInvoiceDetailsResultDto } from '../../../vdc/dto/vdc-invoice-details.result.dto';
import { InvoiceFactoryVdcService } from './invoice-factory-vdc.service';
import { InvoiceDetailVdcModel } from '../interface/invoice-detail-vdc.interface';
import {
  VdcInvoiceCalculatorDto,
  VdcInvoiceCalculatorResultDto,
} from '../dto/vdc-invoice-calculator.dto';

@Injectable()
export class InvoicesService implements BaseInvoiceService {
  constructor(
    private readonly validationService: InvoiceValidationService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly invoicesTable: InvoicesTableService,
    private readonly costCalculationService: CostCalculationService,
    private readonly transactionTable: TransactionsTableService,
    private readonly invoiceVdcFactory: InvoiceFactoryVdcService,
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
      return InvoiceIdDto.generateMock();
    }
  }

  async getVdcInvoiceDetails(
    invoiceId: string,
  ): Promise<VdcInvoiceDetailsResultDto> {
    const res: VdcInvoiceDetailsResultDto = {};

    //We should Join in this way == > Invoice --> InvoiceItem --> view.ServiceItemTypesTree
    const vdcInvoiceDetailsModels =
      await this.invoiceVdcFactory.getVdcInvoiceDetailModel(invoiceId);

    const {
      cpuModel,
      ramModel,
      diskModel,
      ipModel,
      vmModel,
      generation,
      reservationRam,
      reservationCpu,
      period,
      guaranty,
    } = this.invoiceVdcFactory.getVdcInvoiceDetailInfo(vdcInvoiceDetailsModels);

    this.invoiceVdcFactory.fillRes(
      res,
      cpuModel as InvoiceDetailVdcModel,
      ramModel as InvoiceDetailVdcModel,
      diskModel as InvoiceDetailVdcModel[],
      ipModel as InvoiceDetailVdcModel,
      generation,
      reservationCpu,
      reservationRam,
      vmModel as InvoiceDetailVdcModel,
      guaranty,
      period,
    );

    return res;
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
    const dto = await this.invoiceFactoryService.createInvoiceDto(
      userId,
      data,
      invoiceCost,
      groupedItems,
      serviceInstanceId,
    );

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

  async vdcInvoiceCalculator(
    dto: VdcInvoiceCalculatorDto,
  ): Promise<VdcInvoiceCalculatorResultDto> {
    const calculatedCost =
      await this.costCalculationService.calculateVdcStaticTypeInvoice(dto);
    if (dto.servicePlanTypes === ServicePlanTypeEnum.Static) {
      const resultDto: VdcInvoiceCalculatorResultDto = {
        cost: calculatedCost.totalCost,
      };
      return resultDto;
    }
  }
}
