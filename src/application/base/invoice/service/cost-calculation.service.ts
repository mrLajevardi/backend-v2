import { Injectable } from '@nestjs/common';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../dto/create-service-invoice.dto';
import {
  InvoiceGroupItem,
  VdcGenerationItems,
  VdcItemGroup,
} from '../interface/vdc-item-group.interface.dto';
import { InvoiceFactoryService } from './invoice-factory.service';
import {
  InvoiceItemCost,
  TotalInvoiceItemCosts,
} from '../interface/invoice-item-cost.interface';
import { DiskItemCodes } from '../../itemType/enum/item-type-codes.enum';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import { CalculateOptions } from '../interface/calculate-options.interface';

@Injectable()
export class CostCalculationService {
  constructor(
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly serviceItemTypeTreeService: ServiceItemTypesTreeService,
  ) {}

  async calculateVdcGenerationItems(
    groupedItems: VdcItemGroup,
  ): Promise<Omit<TotalInvoiceItemCosts, 'totalCost'>> {
    const computeResources = {
      cpu: groupedItems.generation.cpu,
      ram: groupedItems.generation.ram,
    };
    const computeResourceCosts = await this.calculateComputeResourcesCosts(
      computeResources,
      {
        cpuReservation: groupedItems.cpuReservation,
        memoryReservation: groupedItems.memoryReservation,
      },
    );
    const disksCosts = await this.calculateDisksCosts(
      groupedItems.generation.disk,
      groupedItems.generation.ram[0],
      groupedItems.generation.vm[0],
    );
    const otherItems: InvoiceGroupItem[] = [].concat(
      groupedItems.generation.vm,
      groupedItems.generation.ip,
    );
    const otherItemsCosts = this.calculateOtherVdcItems(otherItems);
    let totalCost = 0;
    let itemsSum: InvoiceItemCost[] = [];
    itemsSum = itemsSum.concat(
      computeResourceCosts,
      disksCosts,
      otherItemsCosts,
    );
    itemsSum.forEach((item) => {
      totalCost += item.cost;
    });
    // adding items that don't have cost
    itemsSum = itemsSum.concat([
      groupedItems.memoryReservation,
      groupedItems.cpuReservation,
      groupedItems.period,
      groupedItems.guaranty,
    ]);
    return {
      itemsSum,
      itemsTotalCosts: totalCost,
    };
  }

  async calculateVdcStaticTypeInvoice(
    invoice: Partial<CreateServiceInvoiceDto>,
    options: CalculateOptions = { applyPeriodPercent: true },
  ): Promise<TotalInvoiceItemCosts> {
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      invoice.itemsTypes,
    );
    const totalInvoiceItemCosts = await this.calculateVdcGenerationItems(
      groupedItems,
    );
    const periodItem = groupedItems.period;
    const itemsPeriodCost =
      totalInvoiceItemCosts.itemsTotalCosts * parseInt(periodItem.value);
    const discountValue = options.applyPeriodPercent
      ? itemsPeriodCost * periodItem.percent
      : 0;
    const periodTotalCost = itemsPeriodCost + discountValue;
    const supportCosts = groupedItems.guaranty.fee * parseInt(periodItem.value);
    const invoiceTotalCosts = periodTotalCost + supportCosts;
    return {
      itemsTotalCosts: totalInvoiceItemCosts.itemsTotalCosts,
      itemsSum: totalInvoiceItemCosts.itemsSum,
      totalCost: invoiceTotalCosts,
    };
  }
  async calculateRemainingPeriod(
    currentInvoiceItems: InvoiceItemsDto[],
    newInvoice: InvoiceItemsDto[],
    groupedItems: VdcItemGroup,
    groupedOldItems: VdcItemGroup,
    remainingDays: number,
  ): Promise<TotalInvoiceItemCosts> {
    const currentInvoiceCost = await this.calculateVdcStaticTypeInvoice(
      {
        itemsTypes: currentInvoiceItems,
      },
      { applyPeriodPercent: false },
    );
    currentInvoiceCost.totalCost =
      currentInvoiceCost.totalCost /
      (30 * Number(groupedOldItems.period.value));
    const newInvoiceCost = await this.calculateVdcStaticTypeInvoice(
      {
        itemsTypes: newInvoice,
      },
      {
        applyPeriodPercent: false,
      },
    );
    newInvoiceCost.totalCost =
      newInvoiceCost.totalCost / (30 * Number(groupedItems.period.value));
    newInvoiceCost.totalCost =
      (newInvoiceCost.totalCost - currentInvoiceCost.totalCost) * remainingDays;
    return newInvoiceCost;
  }
  async calculateComputeResourcesCosts(
    generationsItem: Pick<VdcGenerationItems, 'cpu' | 'ram'>,
    reservations: Pick<VdcItemGroup, 'cpuReservation' | 'memoryReservation'>,
  ): Promise<InvoiceItemCost[]> {
    const cpuItem = generationsItem.cpu[0];
    console.log(generationsItem.cpu[0].parentId, '🥖');
    const cpuParent = await this.serviceItemTypeTreeService.findOne({
      where: {
        id: generationsItem.cpu[0].parentId,
      },
    });
    const ramItem = generationsItem.ram[0];
    const ramParent = await this.serviceItemTypeTreeService.findOne({
      where: {
        id: generationsItem.ram[0].parentId,
      },
    });
    const cpuCost =
      cpuParent.fee *
      parseInt(cpuItem.value) *
      (cpuItem.percent + 1) *
      (reservations.cpuReservation.percent + 1);
    const ramCost =
      ramParent.fee *
      parseInt(ramItem.value) *
      (ramItem.percent + 1) *
      (reservations.memoryReservation.percent + 1);
    const result = [
      { ...cpuItem, cost: cpuCost },
      {
        ...ramItem,
        cost: ramCost,
      },
    ];
    return result;
  }
  async calculateDisksCosts(
    invoiceItem: InvoiceGroupItem[],
    ramItem: InvoiceGroupItem,
    vmItem: InvoiceGroupItem,
  ): Promise<InvoiceItemCost[]> {
    const diskItemCosts: InvoiceItemCost[] = [];
    for (const diskItem of invoiceItem) {
      const diskItemCost = diskItem.fee * parseInt(diskItem.value);
      if (diskItem.code === DiskItemCodes.Standard) {
        const swapValue = parseInt(ramItem.value) * parseInt(vmItem.value);
        const swapDiskItemCost = diskItem.fee * swapValue;
        const swapItem = await this.serviceItemTypeTreeService.findOne({
          where: {
            parentId: diskItem.parentId,
            code: DiskItemCodes.Swap,
          },
        });
        diskItemCosts.push({
          ...swapItem,
          cost: swapDiskItemCost,
          value: swapValue.toString(),
        });
      }
      diskItemCosts.push({ ...diskItem, cost: diskItemCost });
    }
    return diskItemCosts;
  }

  calculateOtherVdcItems(invoiceItem: InvoiceGroupItem[]): InvoiceItemCost[] {
    const otherItemCosts: InvoiceItemCost[] = [];
    for (const otherItem of invoiceItem) {
      const otherItemCost = otherItem.fee * parseInt(otherItem.value);
      otherItemCosts.push({ ...otherItem, cost: otherItemCost });
    }
    return otherItemCosts;
  }
}
