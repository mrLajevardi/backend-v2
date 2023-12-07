import { Injectable } from '@nestjs/common';
import { CostCalculationService } from './cost-calculation.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../dto/create-service-invoice.dto';
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
import { TemplatesTableService } from '../../crud/templates/templates-table.service';
import { TemplatesStructure } from 'src/application/vdc/dto/templates.dto';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { IsNull, Not } from 'typeorm';
import { InvoiceTypes } from '../enum/invoice-type.enum';
import { VdcFactoryService } from 'src/application/vdc/service/vdc.factory.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import {
  VdcGenerationItems,
  VdcItemGroup,
} from '../interface/vdc-item-group.interface.dto';
import { UpgradeAndExtendDto } from '../dto/upgrade-and-extend.dto';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { DiskItemCodes } from '../../itemType/enum/item-type-codes.enum';

@Injectable()
export class InvoicesService implements BaseInvoiceService {
  constructor(
    private readonly validationService: InvoiceValidationService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly invoicesTable: InvoicesTableService,
    private readonly costCalculationService: CostCalculationService,
    private readonly transactionTable: TransactionsTableService,
    private readonly invoiceVdcFactory: InvoiceFactoryVdcService,
    private readonly templateTableService: TemplatesTableService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
  ) {}

  async createVdcInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    await this.validationService.vdcInvoiceValidator(dto);
    if (dto.servicePlanTypes === ServicePlanTypeEnum.Static) {
      switch (dto.type) {
        case InvoiceTypes.Create:
          return this.createVdcStaticInvoice(dto, options, null);
      }

      return InvoiceIdDto.generateMock();
    }
  }

  async upgradeAndExtendInvoice(
    invoice: UpgradeAndExtendDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      invoice.itemsTypes,
    );
    const checkGenerationNotExists = Object.values(
      groupedItems.generation,
    ).some((value: VdcGenerationItems[]) => value.length === 0);
    if (!checkGenerationNotExists) {
      return this.upgradeVdcStaticInvoice(options, invoice); // TODO
    }
    if (groupedItems.period) {
      return this.extendService(
        invoice.serviceInstanceId,
        groupedItems.period,
        options,
      );
    }
  }

  async getVdcInvoiceDetails(
    invoiceId: string,
    serviceType = 'vdc',
  ): Promise<VdcInvoiceDetailsResultDto> {
    const res: VdcInvoiceDetailsResultDto = {};

    //We should Join in this way == > Invoice --> InvoiceItem --> view.ServiceItemTypesTree
    const vdcInvoiceDetailsModels =
      await this.invoiceVdcFactory.getVdcInvoiceDetailModel(
        invoiceId,
        serviceType,
      );

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
    if (data.templateId) {
      return this.createStaticInvoiceByTemplate(data, userId);
    }
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
      Number(groupedItems.period.value) * 30,
      new Date(),
    );
    const invoice = await this.invoicesTable.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      invoice.id,
      invoiceCost.itemsSum,
      groupedItems,
    );
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

  async createStaticInvoiceByTemplate(
    data: CreateServiceInvoiceDto,
    userId: number,
  ): Promise<InvoiceIdDto> {
    const template = await this.templateTableService.findById(data.templateId);
    const templateStructure: TemplatesStructure = JSON.parse(
      template.structure,
    );
    const invoiceItems =
      this.invoiceFactoryService.convertTemplateToInvoiceItems(
        templateStructure,
      );
    data.itemsTypes = invoiceItems;
    const invoiceCost =
      await this.costCalculationService.calculateVdcStaticTypeInvoice(data);
    // changed totalCost to template cost
    invoiceCost.totalCost = templateStructure.finalPrice;
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      data.itemsTypes,
    );
    const dto = await this.invoiceFactoryService.createInvoiceDto(
      userId,
      data,
      invoiceCost,
      groupedItems,
      data.serviceInstanceId || null,
      Number(groupedItems.period.value) * 30,
      new Date(),
    );
    const invoice = await this.invoicesTable.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      invoice.id,
      invoiceCost.itemsSum,
      groupedItems,
    );
    return { invoiceId: invoice.id };
  }

  async upgradeVdcStaticInvoice(
    options: SessionRequest,
    data: UpgradeAndExtendDto,
  ): Promise<InvoiceIdDto> {
    const userId = options.user.userId;
    const service = await this.serviceInstanceTableService.findById(
      data.serviceInstanceId,
    );
    const date =
      new Date().getTime() >= new Date(service.expireDate).getTime()
        ? new Date()
        : new Date(service.expireDate);
    let remainingDays = service.daysLeft;
    let invoiceType = InvoiceTypes.Upgrade;
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      data.itemsTypes,
    );
    const serviceItems = await this.serviceItemsTableService.find({
      where: {
        serviceInstanceId: data.serviceInstanceId,
      },
    });
    const transformedItems =
      this.vdcFactoryService.transformItems(serviceItems);
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
    if (groupedItems.period) {
      invoiceType = InvoiceTypes.UpgradeAndExtend;
      remainingDays = Number(groupedItems.period.value) * 30 + remainingDays;
      await this.validationService.checkExtendVdcInvoice(
        groupedItems.period,
        service,
      );
    } else {
      groupedItems.period = groupedOldItems.period;
      data.itemsTypes.push({
        itemTypeId: groupedItems.period.id,
        value: groupedItems.period.value,
      });
    }

    // check upgrade vdc
    await this.validationService.checkUpgradeVdc(data, service);
    const finalInvoiceCost =
      await this.costCalculationService.calculateRemainingPeriod(
        transformedItems,
        data.itemsTypes,
        groupedItems,
        groupedOldItems,
        remainingDays,
      );
    const convertedInvoice: CreateServiceInvoiceDto = {
      ...data,
      templateId: null,
      type: invoiceType,
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
    const invoice = await this.invoicesTable.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      invoice.id,
      finalInvoiceCost.itemsSum,
      groupedItems,
    );
    return {
      invoiceId: invoice.id,
    };
  }

  async getTransaction(
    options: SessionRequest,
    authorityCode: string,
  ): Promise<Transactions> {
    return this.transactionTable.findOne({
      where: {
        paymentToken: authorityCode,
        invoiceId: Not(IsNull()),
        userId: options.user.userId,
      },
    });
  }

  async extendService(
    serviceInstanceId: string,
    periodItem: VdcItemGroup['period'],
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    const service = await this.serviceInstanceTableService.findById(
      serviceInstanceId,
    );
    await this.validationService.checkExtendVdcInvoice(periodItem, service);
    const date =
      new Date().getTime() >= new Date(service.expireDate).getTime()
        ? new Date()
        : new Date(service.expireDate);
    const serviceItems = await this.serviceItemsTableService.find({
      where: {
        serviceInstanceId,
      },
    });
    const transformedItems =
      this.vdcFactoryService.transformItems(serviceItems);
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      transformedItems,
    );
    const newItems = transformedItems.map((item) => {
      if (item.itemTypeId === groupedItems.period.id) {
        return {
          itemTypeId: periodItem.id,
          value: periodItem.value,
        };
      }
      return item;
    });
    const swapItemIndex = newItems.findIndex((item) => {
      if (
        item.itemTypeId ===
        groupedItems.generation.disk.find(
          (item) => item.code === DiskItemCodes.Swap,
        ).id
      ) {
        return item;
      }
    });
    newItems.splice(swapItemIndex, 1);
    const invoice: CreateServiceInvoiceDto = {
      itemsTypes: newItems,
      serviceInstanceId,
      servicePlanTypes: service.servicePlanType,
      templateId: null,
      type: InvoiceTypes.Extend,
    };

    const invoiceCost =
      await this.costCalculationService.calculateVdcStaticTypeInvoice(invoice);
    const dto = await this.invoiceFactoryService.createInvoiceDto(
      options.user.userId,
      invoice,
      invoiceCost,
      groupedItems,
      serviceInstanceId,
      Number(groupedItems.period.value) * 30,
      date,
    );
    const createdInvoice = await this.invoicesTable.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      createdInvoice.id,
      invoiceCost.itemsSum,
      groupedItems,
    );
    return { invoiceId: createdInvoice.id };
  }
}
