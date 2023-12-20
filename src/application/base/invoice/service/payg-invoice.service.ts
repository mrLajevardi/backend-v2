import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaygVdcServiceDto } from '../dto/create-payg-vdc-service.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { InvoiceFactoryService } from './invoice-factory.service';
import { InvoiceIdDto } from '../dto/invoice-id.dto';
import { PaygCostCalculationService } from './payg-cost-calculation.service';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { InvoiceTypes } from '../enum/invoice-type.enum';
import * as paygConfg from '../../service/configs/payg.conf.json';
import { TemplatesTableService } from '../../crud/templates/templates-table.service';
import { TemplatesStructure } from 'src/application/vdc/dto/templates.dto';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';

@Injectable()
export class PaygInvoiceService {
  constructor(
    private readonly invoiceTableService: InvoicesTableService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly paygCostCalculationService: PaygCostCalculationService,
    private readonly templateTableService: TemplatesTableService,
    private readonly serviceI: ServiceItemTypesTreeService,
  ) {}

  async createPaygInvoice(
    data: CreatePaygVdcServiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    const userId = options.user.userId;
    if (data.duration < paygConfg.minimumDuration) {
      throw new BadRequestException();
    }
    const serviceInstanceId = null;
    if (data.templateId) {
      await this.createPaygInvoiceFromTemplate(data);
    }
    const cost =
      await this.paygCostCalculationService.calculateVdcPaygTypeInvoice(data);
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      data.itemsTypes,
    );
    const completeData: CreateServiceInvoiceDto = {
      itemsTypes: data.itemsTypes,
      serviceInstanceId,
      servicePlanTypes: ServicePlanTypeEnum.Payg,
      templateId: null,
      type: InvoiceTypes.Create,
    };
    cost.itemsTotalCosts = cost.itemsTotalCosts * 60;
    const dto = await this.invoiceFactoryService.createInvoiceDto(
      userId,
      completeData,
      cost,
      groupedItems,
      serviceInstanceId,
      null,
      new Date(),
    );
    const invoice = await this.invoiceTableService.create(dto);
    cost.itemsSum = cost.itemsSum.filter((item) => item?.code !== undefined);
    await this.invoiceFactoryService.createInvoiceItems(
      invoice.id,
      cost.itemsSum,
      groupedItems,
    );
    return {
      invoiceId: invoice.id,
    };
  }

  async createPaygInvoiceFromTemplate(
    data: CreatePaygVdcServiceDto,
  ): Promise<void> {
    const template = await this.templateTableService.findById(data.templateId);
    const templateStructure: TemplatesStructure = JSON.parse(
      template.structure,
    );
    const invoiceItems =
      this.invoiceFactoryService.convertTemplateToInvoiceItems(
        templateStructure,
      );
    data.itemsTypes = invoiceItems;
    data.duration = templateStructure.duration;
  }
}
