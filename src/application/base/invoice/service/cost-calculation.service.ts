import { Injectable } from '@nestjs/common';
import { ServiceTypes } from 'src/infrastructure/database/entities/ServiceTypes';
import {
  CreateServiceInvoiceDto,
  InvoiceItemsDto,
} from '../dto/create-service-invoice.dto';
import { Plans } from 'src/infrastructure/database/entities/Plans';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { CreateInvoiceItemsDto } from '../../crud/invoice-items-table/dto/create-invoice-items.dto';
import {
  InvoiceGroupItem,
  VdcGenerationItems,
  VdcItemGroup,
} from '../interface/vdc-item-group.interface.dto';
import { InvoiceFactoryService } from './invoice-factory.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';

@Injectable()
export class CostCalculationService {
  constructor(
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly itemTypeTableService: ItemTypesTableService,
  ) {}
  async calculateVdcStaticTypeInvoice(
    invoice: CreateServiceInvoiceDto,
  ): Promise<number> {
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
    const disksCosts = this.calculateDisksCosts(groupedItems.generation.disk);
    const otherItemsCosts = this.calculateComputeResourcesCosts;
  }

  // async groupVdcItems ()

  async calculateComputeResourcesCosts(
    generationsItem: Pick<VdcGenerationItems, 'cpu' | 'memory'>,
    reservations: Pick<VdcItemGroup, 'cpuReservation' | 'memoryReservation'>,
  ): number {
    
  }
  calculateDisksCosts(invoiceItem: InvoiceGroupItem[]): number {
    return 1;
  }
  calculateOtherVdcItems(invoiceItem: InvoiceGroupItem[]): number {
    return 1;
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
