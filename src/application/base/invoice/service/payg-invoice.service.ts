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
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { transferItems } from '../utils/transfer-items.utils';
import { DiskItemCodes } from '../../itemType/enum/item-type-codes.enum';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { TotalInvoiceItemCosts } from '../interface/invoice-item-cost.interface';

@Injectable()
export class PaygInvoiceService {
  constructor(
    private readonly invoiceTableService: InvoicesTableService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly paygCostCalculationService: PaygCostCalculationService,
    private readonly templateTableService: TemplatesTableService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
  ) {}

  async createPaygInvoice(
    data: CreatePaygVdcServiceDto,
    options: SessionRequest,
    invoiceType: InvoiceTypes,
  ): Promise<InvoiceIdDto> {
    const userId = options.user.userId;
    if (data.duration < paygConfg.minimumDuration) {
      throw new BadRequestException();
    }
    const serviceInstanceId = null;
    let template: TemplatesStructure;
    if (data.templateId) {
      template = await this.createPaygInvoiceFromTemplate(data);
    }
    const cost =
      await this.paygCostCalculationService.calculateVdcPaygTypeInvoice(data);
    if (template) {
      cost.totalCost = template.finalPrice;
    }
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      data.itemsTypes,
    );
    const completeData: CreateServiceInvoiceDto = {
      itemsTypes: data.itemsTypes,
      serviceInstanceId,
      servicePlanTypes: ServicePlanTypeEnum.Payg,
      templateId: data.templateId ?? null,
      type: invoiceType,
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
  ): Promise<TemplatesStructure> {
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
    return templateStructure;
  }

  async checkAllUserCredit() {
    return 10000000;
  }
  async paygUpgradeInvoice(
    data: CreatePaygVdcServiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    const userId = options.user.userId;
    const service = await this.serviceInstanceTableService.findById(
      data.serviceInstanceId,
    );
    const date =
      new Date().getTime() >= new Date(service.expireDate).getTime()
        ? new Date()
        : new Date(service.expireDate);
    const remainingDays = data.duration;
    const invoiceType = InvoiceTypes.UpgradeAndExtend;
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      data.itemsTypes,
    );
    const serviceItems = await this.serviceItemsTableService.find({
      where: {
        serviceInstanceId: data.serviceInstanceId,
      },
    });
    const transformedItems = transferItems(serviceItems);
    const groupedOldItems = await this.invoiceFactoryService.groupVdcItems(
      transformedItems,
    );
    const swapItem = groupedOldItems.generation.disk.find(
      (item) => item.code === DiskItemCodes.Swap,
    );
    const swapItemIndex = transformedItems.findIndex((item) => {
      if (item.itemTypeId === swapItem.id) {
        groupedOldItems.generation.disk.splice(
          groupedOldItems.generation.disk.indexOf(swapItem),
          1,
        );
        return item;
      }
    });
    transformedItems.splice(swapItemIndex, 1);

    await this.invoiceFactoryService.sumItems(groupedItems, groupedOldItems);
    const finalInvoiceCost =
      await this.paygCostCalculationService.calculateVdcPaygTypeInvoice(
        data,
        60 * 24,
        groupedItems,
      );

    // check upgrade vdc

    // await this.validationService.checkUpgradeVdc(data, service);
    const convertedInvoice: CreateServiceInvoiceDto = {
      ...data,
      templateId: null,
      type: invoiceType,
      servicePlanTypes: ServicePlanTypeEnum.Payg,
      serviceInstanceId: data.serviceInstanceId,
    };
    const dto = await this.invoiceFactoryService.createInvoiceDto(
      userId,
      convertedInvoice,
      finalInvoiceCost,
      groupedItems,
      data.serviceInstanceId,
      remainingDays,
      date,
    );
    const invoice = await this.invoiceTableService.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      invoice.id,
      finalInvoiceCost.itemsSum,
      groupedItems,
    );
    return {
      invoiceId: invoice.id,
    };
  }
}
