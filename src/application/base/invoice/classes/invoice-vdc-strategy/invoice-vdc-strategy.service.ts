import { Injectable } from '@nestjs/common';
import { CreateServiceInvoiceDto } from '../../dto/create-service-invoice.dto';
import { SessionRequest } from '../../../../../infrastructure/types/session-request.type';
import { InvoiceIdDto } from '../../dto/invoice-id.dto';
import { ServicePlanTypeEnum } from '../../../service/enum/service-plan-type.enum';
import { InvoiceTypes } from '../../enum/invoice-type.enum';
import { TemplatesStructure } from '../../../../vdc/dto/templates.dto';
import { CostCalculationService } from '../../service/cost-calculation.service';
import { InvoiceFactoryService } from '../../service/invoice-factory.service';
import { InvoicesTableService } from '../../../crud/invoices-table/invoices-table.service';
import { TemplatesTableService } from '../../../crud/templates/templates-table.service';
import { VdcInvoiceDetailsResultDto } from '../../../../vdc/dto/vdc-invoice-details.result.dto';
import { InvoiceDetailVdcModel } from '../../interface/invoice-detail-vdc.interface';
import { InvoiceFactoryVdcService } from '../../service/invoice-factory-vdc.service';
import { ServiceTypesEnum } from '../../../service/enum/service-types.enum';
import { UpgradeAndExtendDto } from '../../dto/upgrade-and-extend.dto';
import {
  VdcGenerationItems,
  VdcItemGroup,
} from '../../interface/vdc-item-group.interface.dto';
import {
  InvoiceCalculatorDto,
  InvoiceCalculatorResultDto,
} from '../../dto/invoice-calculator.dto';
import {
  DiskItemCodes,
  ItemTypeCodes,
} from '../../../itemType/enum/item-type-codes.enum';
import { TotalInvoiceItemCosts } from '../../interface/invoice-item-cost.interface';
import { VdcFactoryService } from '../../../../vdc/service/vdc.factory.service';
import { ServiceItemsTableService } from '../../../crud/service-items-table/service-items-table.service';
import { ServiceInstancesTableService } from '../../../crud/service-instances-table/service-instances-table.service';
import { InvoiceValidationService } from '../../validators/invoice-validation.service';
import { InvoiceVdcStrategyInterface } from '../interface/invoice-vdc-strategy.interface';

@Injectable()
export class InvoiceVdcStrategyService implements InvoiceVdcStrategyInterface {
  constructor(
    private readonly costCalculationService: CostCalculationService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly invoicesTableService: InvoicesTableService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
    private readonly templatesTableService: TemplatesTableService,
    private readonly invoiceFactoryVdcService: InvoiceFactoryVdcService,
    private readonly validationService: InvoiceValidationService,
  ) {}
  async createInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    if (dto.servicePlanTypes === ServicePlanTypeEnum.Static) {
      switch (dto.type) {
        case InvoiceTypes.Create:
          return this.createStaticInvoice(dto, options, null);
      }

      return InvoiceIdDto.generateMock();
    }
  }

  async createStaticInvoice(
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
    const invoice = await this.invoicesTableService.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      invoice.id,
      invoiceCost.itemsSum,
      groupedItems,
    );
    return { invoiceId: invoice.id };
  }

  async createStaticInvoiceByTemplate(
    data: CreateServiceInvoiceDto,
    userId: number,
  ): Promise<InvoiceIdDto> {
    const template = await this.templatesTableService.findById(data.templateId);
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
    dto.finalAmount = templateStructure.finalPrice;
    const invoice = await this.invoicesTableService.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      invoice.id,
      invoiceCost.itemsSum,
      groupedItems,
    );
    return { invoiceId: invoice.id };
  }

  async getInvoiceDetails(
    invoiceId: string,
  ): Promise<VdcInvoiceDetailsResultDto> {
    const serviceType = ServiceTypesEnum.Vdc;

    const res: VdcInvoiceDetailsResultDto = new VdcInvoiceDetailsResultDto();

    //We should Join in this way == > Invoice --> InvoiceItem --> view.ServiceItemTypesTree
    const vdcInvoiceDetailsModels =
      await this.invoiceFactoryVdcService.getVdcInvoiceDetailModel(
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
    } = this.invoiceFactoryVdcService.getVdcInvoiceDetailInfo(
      vdcInvoiceDetailsModels,
    );

    this.invoiceFactoryVdcService.fillRes(
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

  async upgradeAndExtendInvoice(
    invoice: UpgradeAndExtendDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      invoice.itemsTypes,
    );
    const checkGenerationExists = Object.values(groupedItems.generation).some(
      (value: VdcGenerationItems[]) => value.length !== 0,
    );
    if (checkGenerationExists) {
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

  async invoiceCalculator(
    dto: InvoiceCalculatorDto,
  ): Promise<InvoiceCalculatorResultDto> {
    const calculatedCost =
      await this.costCalculationService.calculateVdcStaticTypeInvoice(dto);
    if (dto.servicePlanTypes === ServicePlanTypeEnum.Static) {
      const resultDto: InvoiceCalculatorResultDto = {
        cost: calculatedCost.totalCost,
      };
      return resultDto;
    }
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
    const oldSwapValue = Number(swapItem.value);
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

    let finalInvoiceCost: TotalInvoiceItemCosts;
    if (invoiceType === InvoiceTypes.UpgradeAndExtend) {
      await this.invoiceFactoryService.sumItems(groupedItems, groupedOldItems);
      finalInvoiceCost =
        await this.costCalculationService.calculateVdcStaticTypeInvoice(
          data,
          { applyPeriodPercent: true },
          groupedItems,
        );
      console.log('first');
    }
    // check upgrade vdc
    // await this.validationService.checkUpgradeVdc(data, service);
    if (invoiceType === InvoiceTypes.Upgrade) {
      finalInvoiceCost =
        await this.costCalculationService.calculateRemainingPeriod(
          transformedItems,
          data.itemsTypes,
          groupedItems,
          groupedOldItems,
          remainingDays,
          invoiceType,
        );
      const swap = finalInvoiceCost.itemsSum.find(
        (item) => item.code === DiskItemCodes.Swap,
      );
      finalInvoiceCost.itemsSum.forEach((value) => {
        if (
          value.code === ItemTypeCodes.CpuReservationItem ||
          value.code === ItemTypeCodes.MemoryReservationItem ||
          value.code === ItemTypeCodes.GuarantyItem ||
          value.code === ItemTypeCodes.PeriodItem
        ) {
          value.value = '0';
        }
      });
      const ramSum =
        Number(groupedOldItems.generation.ram[0].value) +
        Number(groupedItems.generation.ram[0].value);

      const vmSum =
        Number(groupedOldItems.generation.vm[0].value) +
        Number(groupedItems.generation.vm[0].value);
      swap.value = String(ramSum * vmSum - oldSwapValue);
    }
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
    const invoice = await this.invoicesTableService.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      invoice.id,
      finalInvoiceCost.itemsSum,
      groupedItems,
    );
    return {
      invoiceId: invoice.id,
    };
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
    const newItems = [];
    await this.invoiceFactoryService.recalculateItemTypes(
      newItems,
      groupedItems,
      periodItem,
      transformedItems,
    );
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
      Number(periodItem.value) * 30,
      date,
    );
    const createdInvoice = await this.invoicesTableService.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      createdInvoice.id,
      invoiceCost.itemsSum,
      groupedItems,
    );
    return { invoiceId: createdInvoice.id };
  }
}
