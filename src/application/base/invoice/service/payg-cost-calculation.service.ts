import { Injectable } from '@nestjs/common';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../dto/create-service-invoice.dto';
import { InvoiceFactoryService } from './invoice-factory.service';
import { CostCalculationService } from './cost-calculation.service';
import {
  InvoiceItemCost,
  TotalInvoiceItemCosts,
} from '../interface/invoice-item-cost.interface';
import { CreatePaygVdcServiceDto } from '../dto/create-payg-vdc-service.dto';
import { ServiceItems } from '../../../../infrastructure/database/entities/ServiceItems';
import { VdcFactoryService } from '../../../vdc/service/vdc.factory.service';
import { VServiceInstancesTableService } from '../../crud/v-service-instances-table/v-service-instances-table.service';
import { DiskItemCodes } from '../../itemType/enum/item-type-codes.enum';
import { VdcItemGroup } from '../interface/vdc-item-group.interface.dto';
import { ServiceDiscountTableService } from '../../crud/service-discount-table/service-discount-table-service.service';
import { ServiceDiscount } from 'src/infrastructure/database/entities/ServiceDiscount';
import { addDays } from 'src/infrastructure/helpers/date-time.helper';

@Injectable()
export class PaygCostCalculationService {
  constructor(
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly costCalculationService: CostCalculationService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly vServiceInstancesTableService: VServiceInstancesTableService,
    private readonly serviceDiscountTableService: ServiceDiscountTableService,
  ) {}
  async calculateVdcPaygVm(
    service: ServiceInstances,
    startDate: Date,
    endDate: Date,
    cpu: number,
    ram: number,
  ): Promise<InvoiceItemCost[]> {
    const dateDiff = endDate.getTime() - startDate.getTime();
    const dateDiffToMin = Math.round(dateDiff / 1000 / 60);
    const serviceItems = await this.serviceItemsTableService.find({
      where: {
        serviceInstanceId: service.id,
      },
    });
    const transformedItems = serviceItems.map((item) => {
      const invoiceItem: InvoiceItemsDto = {
        itemTypeId: item.itemTypeId,
        value: item.value,
      };
      return invoiceItem;
    });
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      transformedItems,
    );
    groupedItems.generation.cpu[0].value = cpu.toString();
    groupedItems.generation.ram[0].value = (ram / 1024).toString();
    const computeItems = {
      cpu: groupedItems.generation.cpu,
      ram: groupedItems.generation.ram,
    };
    let computeItemsCost =
      await this.costCalculationService.calculateComputeResourcesCosts(
        computeItems,
        {
          cpuReservation: groupedItems.cpuReservation,
          memoryReservation: groupedItems.memoryReservation,
        },
      );
    computeItemsCost = computeItemsCost.map((item) => {
      return {
        ...item,
        cost: item.cost * dateDiffToMin,
        min: dateDiffToMin,
      };
    });
    return computeItemsCost;
  }

  async calculateVdcPaygService(
    computeItems: InvoiceItemCost[],
    service: ServiceInstances,
    durationInMin: number,
  ): Promise<TotalInvoiceItemCosts> {
    console.log(durationInMin);
    const serviceItems = await this.serviceItemsTableService.find({
      where: {
        serviceInstanceId: service.id,
      },
    });
    const transformedItems = serviceItems.map((item) => {
      const invoiceItem: InvoiceItemsDto = {
        itemTypeId: item.itemTypeId,
        value: item.value,
      };
      return invoiceItem;
    });
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      transformedItems,
    );
    groupedItems.generation.disk = groupedItems.generation.disk.filter(
      (item) => item.code !== DiskItemCodes.Swap,
    );
    const diskItemCost = await this.costCalculationService.calculateDisksCosts(
      groupedItems.generation.disk,
      groupedItems.generation.ram[0],
      groupedItems.generation.vm[0],
    );
    const otherItems = [].concat(
      groupedItems.generation.ip,
      groupedItems.generation.vm,
    );
    const otherItemsCost =
      this.costCalculationService.calculateOtherVdcItems(otherItems);
    let itemsSum: InvoiceItemCost[] = [];
    let totalCost = 0;
    itemsSum = itemsSum.concat(diskItemCost, otherItemsCost);
    itemsSum.forEach((item) => {
      totalCost += item.cost * durationInMin;
    });
    computeItems.forEach((item) => {
      totalCost += item.cost;
    });
    itemsSum = itemsSum.concat(computeItems);
    const totalInvoiceItemCosts: Pick<
      TotalInvoiceItemCosts,
      'itemsSum' | 'itemsTotalCosts'
    > = {
      itemsSum: itemsSum,
      itemsTotalCosts: totalCost,
    };
    const templateDiscount = await this.serviceDiscountTableService.findOne({
      where: {
        enabled: true,
        serviceInstanceId: service.id,
      },
    });
    const supportCosts = groupedItems.guaranty.fee * durationInMin;
    itemsSum.push(
      { ...groupedItems.guaranty, cost: supportCosts },
      groupedItems.cpuReservation,
      groupedItems.memoryReservation,
    );
    const expired = await this.checkTemplateDiscount(templateDiscount);
    let invoiceTotalCosts =
      totalInvoiceItemCosts.itemsTotalCosts + supportCosts;
    if (!expired) {
      invoiceTotalCosts =
        invoiceTotalCosts - invoiceTotalCosts * templateDiscount.percent;
    }
    return {
      itemsTotalCosts: totalInvoiceItemCosts.itemsTotalCosts,
      itemsSum: totalInvoiceItemCosts.itemsSum,
      totalCost: invoiceTotalCosts,
      serviceCost: totalInvoiceItemCosts.itemsTotalCosts * durationInMin,
      templateDiscount: !expired ? templateDiscount : null,
    };
  }

  async calculateVdcPaygTypeInvoice(
    dto: CreatePaygVdcServiceDto,
    minutes: number = 60 * 24,
    items?: VdcItemGroup | null,
    applyTemplateDiscount = false,
    service?: ServiceInstances,
  ): Promise<TotalInvoiceItemCosts> {
    let templateDiscount: ServiceDiscount;
    if (applyTemplateDiscount) {
      templateDiscount = await this.serviceDiscountTableService.findOne({
        where: {
          enabled: true,
          serviceInstanceId: service.id,
        },
      });
    }
    const expired = await this.checkTemplateDiscount(templateDiscount);
    const templateDiscountValue = !expired ? 1 - templateDiscount.percent : 1;
    const groupedItems =
      items ?? (await this.invoiceFactoryService.groupVdcItems(dto.itemsTypes));
    groupedItems.generation.disk = groupedItems.generation.disk.filter(
      (item) => item.code !== DiskItemCodes.Swap,
    );
    const totalInvoiceItemCosts =
      await this.costCalculationService.calculateVdcGenerationItems(
        groupedItems,
      );
    const supportCosts = groupedItems.guaranty.fee;
    const invoiceTotalCosts =
      (totalInvoiceItemCosts.itemsTotalCosts + supportCosts) *
      dto.duration *
      minutes *
      templateDiscountValue;
    return {
      itemsTotalCosts: totalInvoiceItemCosts.itemsTotalCosts,
      itemsSum: totalInvoiceItemCosts.itemsSum,
      totalCost: invoiceTotalCosts,
      serviceCost:
        totalInvoiceItemCosts.itemsTotalCosts * minutes * dto.duration,
      templateDiscount: !expired ? templateDiscount : null,
    };
  }

  async calculateVdcPaygTimeDuration(serviceInstanceId: string) {
    const serviceItems: ServiceItems[] =
      await this.serviceItemsTableService.find({
        where: {
          serviceInstanceId: serviceInstanceId,
        },
      });

    const invoiceItems: InvoiceItemsDto[] =
      this.vdcFactoryService.transformItems(serviceItems);

    const dailyCost: TotalInvoiceItemCosts =
      await this.calculateVdcPaygTypeInvoice({
        itemsTypes: invoiceItems,
        duration: 1,
      });

    const service = await this.vServiceInstancesTableService.findById(
      serviceInstanceId,
    );

    return Math.round(service.credit / dailyCost.totalCost);
  }

  async checkTemplateDiscount(item: ServiceDiscount): Promise<boolean> {
    if (!item) {
      return true;
    }
    const expireDate = addDays(item.activateDate, item.duration);
    const expired = new Date().getTime() > expireDate.getTime();
    if (expired) {
      await this.serviceDiscountTableService.update(item.guid, {
        enabled: false,
      });
    }
    return expired;
  }
}
