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
import { FindManyOptions, In, IsNull, Like, Not } from 'typeorm';
import { InvoiceTypes } from '../enum/invoice-type.enum';
import { VdcFactoryService } from 'src/application/vdc/service/vdc.factory.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import {
  VdcGenerationItems,
  VdcItemGroup,
} from '../interface/vdc-item-group.interface.dto';
import { UpgradeAndExtendDto } from '../dto/upgrade-and-extend.dto';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import {
  DiskItemCodes,
  ItemTypeCodes,
} from '../../itemType/enum/item-type-codes.enum';
import { Invoices } from '../../../../infrastructure/database/entities/Invoices';
import { TotalInvoiceItemCosts } from '../interface/invoice-item-cost.interface';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';
import { contains } from 'class-validator';
import { indexOf, isNil } from 'lodash';
import { BadRequestException } from '../../../../infrastructure/exceptions/bad-request.exception';
import { InvoiceItems } from '../../../../infrastructure/database/entities/InvoiceItems';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { SystemSettingsTableService } from '../../crud/system-settings-table/system-settings-table.service';
import { SystemSettingsPropertyKeysEnum } from '../../crud/system-settings-table/enum/system-settings-property-keys.enum';
import { CreateInvoicesDto } from '../../crud/invoices-table/dto/create-invoices.dto';
import { ServiceItemTypesTree } from '../../../../infrastructure/database/entities/views/service-item-types-tree';
import { addMonths } from '../../../../infrastructure/helpers/date-time.helper';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { NotFoundException } from '../../../../infrastructure/exceptions/not-found.exception';
import { Templates } from '../../../../infrastructure/database/entities/Templates';
import { CreateInvoiceItemsDto } from '../../crud/invoice-items-table/dto/create-invoice-items.dto';

@Injectable()
export class InvoicesService implements BaseInvoiceService {
  constructor(
    private readonly validationService: InvoiceValidationService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly invoicesTable: InvoicesTableService,
    private readonly invoiceItemsTableService: InvoiceItemsTableService,
    private readonly costCalculationService: CostCalculationService,
    private readonly transactionTable: TransactionsTableService,
    private readonly invoiceVdcFactory: InvoiceFactoryVdcService,
    private readonly templateTableService: TemplatesTableService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
    private readonly serviceItemTreeTableService: ServiceItemTypesTreeService,
    private readonly systemSettingsTableService: SystemSettingsTableService,
    private readonly serviceTypesTableService: ServiceTypesTableService,
  ) {}

  private strategy: any = {
    [ServiceTypesEnum.Vdc]: this.createVdcInvoice,
    [ServiceTypesEnum.Ai]: this.createAiInvoice,
  };

  async createServiceInvoice(
    serviceType: ServiceTypesEnum,
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    await this.validationService.invoiceValidator(serviceType, dto);

    return await this.strategy[serviceType].bind(this)(dto, options);
  }

  async createAiInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    switch (dto.type) {
      case InvoiceTypes.Create:
        return this.createAiStaticInvoice(dto, options);
      default:
        throw new Error(`Unsupported invoice type: ${dto.type}`);
    }
  }
  async calculateTemplateDiscount(templateId: string): Promise<number> {
    const template: Templates = await this.templateTableService.findById(
      templateId,
    );

    if (isNil(template)) {
      throw new BadRequestException();
    }

    const decode = JSON.parse(template.structure);

    if (!isNil(decode.percent)) {
      return Number(decode.percent);
    } else {
      return 0;
    }
  }
  async convertAiTemplateToItemType(
    templateId: string,
  ): Promise<InvoiceItemsDto[]> {
    const template: Templates = await this.templateTableService.findById(
      templateId,
    );
    // TODO must be check template belongs to ai templates
    if (isNil(template)) {
      throw new BadRequestException();
    }
    const decode = JSON.parse(template.structure);
    const invoiceItemsDto: InvoiceItemsDto[] = [];

    for (const key of Object.keys(decode.items)) {
      invoiceItemsDto.push({
        itemTypeId: decode.items[key].id,
        value: decode.items[key].value,
        code: decode.items[key].code,
      } as InvoiceItemsDto);
    }

    return invoiceItemsDto;
  }

  async createAiStaticInvoice(
    data: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
    const userId = options.user.userId;

    let dataItemType: InvoiceItemsDto[];
    let invoiceName = null;
    let discountPercent = 1;

    if (data.templateId) {
      const template: Templates = await this.templateTableService.findById(
        data.templateId,
      );
      invoiceName = template.name;
      const calculateDiscountTemplate: number =
        await this.calculateTemplateDiscount(data.templateId);

      discountPercent = discountPercent - calculateDiscountTemplate;

      dataItemType = await this.convertAiTemplateToItemType(data.templateId);
    } else {
      const count =
        (await this.invoicesTable.count({
          where: {
            userId: userId,
            serviceTypeId: ServiceTypesEnum.Ai,
          },
        })) + 1;
      invoiceName = 'سرویس هوش مصنوعی ' + count;
      dataItemType = data.itemsTypes;
    }

    const periodItem = dataItemType.find(
      (item) => item.code === ItemTypeCodes.Period,
    );
    if (!periodItem) {
      throw new BadRequestException('Period item not found');
    }
    const checkPeriodItem = await this.serviceItemTreeTableService.findById(
      periodItem.itemTypeId,
    );
    if (checkPeriodItem.codeHierarchy.split('_')[0] !== ItemTypeCodes.Period) {
      throw new BadRequestException('Invalid period item type');
    }

    const itemTypesId = dataItemType.map((item) => item.itemTypeId);
    const itemTypes = await this.serviceItemTreeTableService.find({
      where: { id: In(itemTypesId) },
    });

    const invoiceItems = dataItemType.map((item) => {
      const itemType = itemTypes.find(
        (serviceItem) => serviceItem.id === item.itemTypeId,
      );
      const fee =
        item.itemTypeId !== checkPeriodItem.id
          ? this.calculateFee(item.value, itemType.fee)
          : null;
      return {
        ItemID: item.itemTypeId,
        Fee: fee,
        value: item.value,
        codeHierarchy: itemType.codeHierarchy,
      };
    });

    const baseAmount = invoiceItems.reduce(
      (acc, item) => acc + item.Fee || 0,
      0,
    );
    const rawAmount = baseAmount * checkPeriodItem.maxPerRequest;
    const finalAmount =
      rawAmount * (1 + checkPeriodItem.percent) * discountPercent;

    // Retrieve tax percent
    const taxPercent = await this.systemSettingsTableService.findOne({
      where: { propertyKey: SystemSettingsPropertyKeysEnum.TaxPercent },
    });

    // const endDate = addMonths(new Date(), checkPeriodItem.maxPerRequest);
    const serviceType = await this.serviceTypesTableService.findOne({
      where: {
        id: ServiceTypesEnum.Ai,
      },
    });

    const invoice = await this.invoicesTable.create({
      userId,
      baseAmount,
      rawAmount,
      finalAmount,
      dateTime: new Date(),
      // endDateTime: endDate,
      payed: false,
      serviceTypeId: ServiceTypesEnum.Ai,
      invoiceTax: Number(taxPercent.value),
      isPreInvoice: true,
      serviceInstanceId: null,
      description: '',
      serviceCost: rawAmount,
      servicePlanType: ServicePlanTypeEnum.Static,
      voided: false,
      planAmount: 0,
      name: invoiceName,
      datacenterName: serviceType.datacenterName,
      templateId: data.templateId,
    });
    const items: CreateInvoiceItemsDto[] = invoiceItems.map(
      (item): CreateInvoiceItemsDto => {
        return {
          invoiceId: invoice.id,
          itemId: item.ItemID,
          value: item.value?.trim() == '' ? null : item.value,
          fee: item.Fee,
          quantity: 0,
          codeHierarchy: item.codeHierarchy,
        } as CreateInvoiceItemsDto;
      },
    );

    await this.invoiceItemsTableService.createAll(items);

    return { invoiceId: invoice.id };
  }

  calculateFee(value: string | undefined, fee: number): number {
    return !isNil(value) && value.trim() !== '' && Number(value) !== 0
      ? Number(value) * fee
      : fee;
  }

  async createVdcInvoice(
    dto: CreateServiceInvoiceDto,
    options: SessionRequest,
  ): Promise<InvoiceIdDto> {
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

  async getVdcInvoiceDetails(
    invoiceId: string,
    serviceType = 'vdc',
  ): Promise<VdcInvoiceDetailsResultDto> {
    const res: VdcInvoiceDetailsResultDto = new VdcInvoiceDetailsResultDto();

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
        // invoiceId: Not(IsNull()),
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
    const createdInvoice = await this.invoicesTable.create(dto);
    await this.invoiceFactoryService.createInvoiceItems(
      createdInvoice.id,
      invoiceCost.itemsSum,
      groupedItems,
    );
    return { invoiceId: createdInvoice.id };
  }

  async getAll(option: FindManyOptions<Invoices>) {
    return await this.invoicesTable.find(option);
  }
}
