import { Injectable } from '@nestjs/common';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
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
import { DiskItemCodes } from '../enum/item-type-codes.enum';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';

@Injectable()
export class CostCalculationService {
  constructor(
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly serviceItemTypeTreeService: ServiceItemTypesTreeService,
  ) {}
  async calculateVdcStaticTypeInvoice(
    invoice: CreateServiceInvoiceDto,
  ): Promise<TotalInvoiceItemCosts> {
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      invoice.itemsTypes,
    );
    const computeResources = {
      cpu: groupedItems.generation.cpu,
      memory: groupedItems.generation.memory,
    };
    const computeResourceCosts = this.calculateComputeResourcesCosts(
      computeResources,
      {
        cpuReservation: groupedItems.cpuReservation,
        memoryReservation: groupedItems.memoryReservation,
      },
    );
    const disksCosts = await this.calculateDisksCosts(
      groupedItems.generation.disk,
      groupedItems.generation.memory[0],
      groupedItems.generation.vm[0],
    );
    const otherItems = [].concat(
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
    return {
      itemsSum,
      totalCost,
    };
  }

  // async groupVdcItems ()

  calculateComputeResourcesCosts(
    generationsItem: Pick<VdcGenerationItems, 'cpu' | 'memory'>,
    reservations: Pick<VdcItemGroup, 'cpuReservation' | 'memoryReservation'>,
  ): InvoiceItemCost[] {
    const cpuItem = generationsItem.cpu[0];
    const ramItem = generationsItem.memory[0];
    const cpuCost =
      cpuItem.fee *
      parseInt(cpuItem.value) *
      (cpuItem.percent + 1) *
      (reservations.cpuReservation.percent + 1);
    const ramCost =
      ramItem.fee *
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
  // totalCosts(
  //   serviceType: ServiceTypes,
  //   data: CreateServiceInvoiceDto,
  //   items: ItemTypes[],
  //   options = {},
  // ): number {
  //   // console.log(
  //   //   this.itemsCost(items, data, serviceType),
  //   //   this.plansRatioForItems(plans, data),
  //   //   this.plansRatioForInvoice(plans, data),
  //   //   '🧂',
  //   // );
  //   const totalCost =
  //     (this.itemsCost(items, data, serviceType) *
  //       this.plansRatioForItems(plans, data) +
  //       this.plansCost(plans, data, options)) *
  //     this.plansRatioForInvoice(plans, data);
  //   return totalCost;
  // }
  // itemsCost(
  //   items: ItemTypes[],
  //   data: CreateServiceInvoiceDto,
  //   serviceType: ServiceTypes,
  // ): number {
  //   let itemTotalCost = 0;
  //   if (!serviceType.isPayg) {
  //     console.log('first');
  //     items.forEach((element) => {
  //       data.items.forEach((el) => {
  //         if (el.itemCode == element.title) {
  //           itemTotalCost += el.quantity * element.fee;
  //         }
  //       });
  //     });
  //   }
  //   itemTotalCost *= data.duration || 1;
  //   return itemTotalCost;
  // }
  // plansCost(
  //   plans: Plans[],
  //   data: CreateServiceInvoiceDto,
  //   options: any = {},
  // ): number {
  //   if (!options?.calculatePlanCost) {
  //     return 0;
  //   }
  //   let planTotalCost = 0;
  //   plans.forEach((element) => {
  //     data.plans.forEach((el) => {
  //       if (element.code == el) {
  //         planTotalCost += element.additionAmount;
  //       }
  //     });
  //   });
  //   planTotalCost *= data.duration || 1;
  //   return planTotalCost;
  // }
  // plansRatioForInvoice(plans: Plans[], data: CreateServiceInvoiceDto): number {
  //   let planTotalRatio = 1;
  //   let additionRatio;
  //   plans.forEach((element) => {
  //     data.plans.forEach((el) => {
  //       if (element.code == el && element.additionAmount == 0) {
  //         additionRatio = 1 + element.additionRatio;
  //         planTotalRatio *= additionRatio;
  //       }
  //     });
  //   });
  //   return planTotalRatio;
  // }
  // plansRatioForItems(plans: Plans[], data: CreateServiceInvoiceDto): number {
  //   let planTotalRatio = 1;
  //   let additionRatio;
  //   plans.forEach((element) => {
  //     data.plans.forEach((el) => {
  //       if (element.code == el && element.additionAmount != 0) {
  //         additionRatio = 1 + element.additionRatio;
  //         planTotalRatio *= additionRatio;
  //       }
  //     });
  //   });
  //   return planTotalRatio;
}
