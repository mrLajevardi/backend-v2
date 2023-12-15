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
import { CalculateOptions } from '../interface/calculate-options.interface';
import { CreatePaygVdcServiceDto } from '../../service/dto/create-payg-vdc-service.dto';

@Injectable()
export class PaygCostCalculationService {
  constructor(
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly costCalculationService: CostCalculationService,
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
    groupedItems.generation.ram[0].value = ram.toString();
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
      };
    });
    return computeItemsCost;
  }

  async calculateVdcPaygService(
    computeItems: InvoiceItemCost[],
    service: ServiceInstances,
    durationInMin: number,
  ): Promise<TotalInvoiceItemCosts> {
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
    itemsSum = itemsSum.concat(computeItems, diskItemCost, otherItemsCost);
    itemsSum.forEach((item) => {
      totalCost += item.cost;
    });
    const totalInvoiceItemCosts: Omit<TotalInvoiceItemCosts, 'totalCost'> = {
      itemsSum: itemsSum,
      itemsTotalCosts: totalCost,
    };
    const supportCosts = groupedItems.guaranty.fee;
    const invoiceTotalCosts =
      totalInvoiceItemCosts.itemsTotalCosts + supportCosts;
    return {
      itemsTotalCosts: totalInvoiceItemCosts.itemsTotalCosts,
      itemsSum: totalInvoiceItemCosts.itemsSum,
      totalCost: invoiceTotalCosts,
    };
  }

  async calculateVdcPaygTypeInvoice(
    dto: CreatePaygVdcServiceDto,
  ): Promise<TotalInvoiceItemCosts> {
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      dto.itemsTypes,
    );
    const totalInvoiceItemCosts =
      await this.costCalculationService.calculateVdcGenerationItems(
        groupedItems,
      );
    const supportCosts = groupedItems.guaranty.fee;
    const invoiceTotalCosts =
      (totalInvoiceItemCosts.itemsTotalCosts + supportCosts) *
      dto.duration *
      60 *
      24;
    return {
      itemsTotalCosts: totalInvoiceItemCosts.itemsTotalCosts,
      itemsSum: totalInvoiceItemCosts.itemsSum,
      totalCost: invoiceTotalCosts,
    };
  }
}
