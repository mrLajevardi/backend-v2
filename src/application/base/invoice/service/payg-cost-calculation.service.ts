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
import { CreatePaygVdcServiceDto } from '../dto/create-payg-vdc-service.dto';
import { ServiceItems } from '../../../../infrastructure/database/entities/ServiceItems';
import { VdcFactoryService } from '../../../vdc/service/vdc.factory.service';
import { ServiceChecksService } from '../../service/services/service-checks.service';
import { VServiceInstancesTableService } from '../../crud/v-service-instances-table/v-service-instances-table.service';
import { DiskItemCodes } from '../../itemType/enum/item-type-codes.enum';

@Injectable()
export class PaygCostCalculationService {
  constructor(
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly costCalculationService: CostCalculationService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly vServiceInstancesTableService: VServiceInstancesTableService,
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
    itemsSum = itemsSum.concat(itemsSum, computeItems);
    const totalInvoiceItemCosts: Pick<
      TotalInvoiceItemCosts,
      'itemsSum' | 'itemsTotalCosts'
    > = {
      itemsSum: itemsSum,
      itemsTotalCosts: totalCost,
    };
    const supportCosts = groupedItems.guaranty.fee * durationInMin;
    const invoiceTotalCosts =
      totalInvoiceItemCosts.itemsTotalCosts + supportCosts;
    return {
      itemsTotalCosts: totalInvoiceItemCosts.itemsTotalCosts,
      itemsSum: totalInvoiceItemCosts.itemsSum,
      totalCost: invoiceTotalCosts,
      serviceCost: totalInvoiceItemCosts.itemsTotalCosts * durationInMin,
    };
  }

  async calculateVdcPaygTypeInvoice(
    dto: CreatePaygVdcServiceDto,
  ): Promise<TotalInvoiceItemCosts> {
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      dto.itemsTypes,
    );
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
      60 *
      24;
    return {
      itemsTotalCosts: totalInvoiceItemCosts.itemsTotalCosts,
      itemsSum: totalInvoiceItemCosts.itemsSum,
      totalCost: invoiceTotalCosts,
      serviceCost:
        totalInvoiceItemCosts.itemsTotalCosts * 60 * 24 * dto.duration,
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
}
