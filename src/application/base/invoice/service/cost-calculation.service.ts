import { Injectable } from '@nestjs/common';
import { ServiceTypes } from 'src/infrastructure/database/entities/ServiceTypes';
import { CreateServiceInvoiceDto } from '../dto/create-service-invoice.dto';
import { Plans } from 'src/infrastructure/database/entities/Plans';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';

@Injectable()
export class CostCalculationService {
  totalCosts(
    serviceType: ServiceTypes,
    data: CreateServiceInvoiceDto,
    plans: Plans[],
    items: ItemTypes[],
    options = {},
  ): number {
    // console.log(
    //   this.itemsCost(items, data, serviceType),
    //   this.plansRatioForItems(plans, data),
    //   this.plansRatioForInvoice(plans, data),
    //   '🧂',
    // );
    const totalCost =
      (this.itemsCost(items, data, serviceType) *
        this.plansRatioForItems(plans, data) +
        this.plansCost(plans, data, options)) *
      this.plansRatioForInvoice(plans, data);
    return totalCost;
  }

  itemsCost(
    items: ItemTypes[],
    data: CreateServiceInvoiceDto,
    serviceType: ServiceTypes,
  ): number {
    let itemTotalCost = 0;
    if (!serviceType.isPayg) {
      console.log('first');
      items.forEach((element) => {
        data.items.forEach((el) => {
          if (el.itemCode == element.title) {
            itemTotalCost += el.quantity * element.fee;
          }
        });
      });
    }
    itemTotalCost *= data.duration || 1;
    return itemTotalCost;
  }

  plansCost(
    plans: Plans[],
    data: CreateServiceInvoiceDto,
    options: any = {},
  ): number {
    if (!options?.calculatePlanCost) {
      return 0;
    }
    let planTotalCost = 0;
    plans.forEach((element) => {
      data.plans.forEach((el) => {
        if (element.code == el) {
          planTotalCost += element.additionAmount;
        }
      });
    });
    planTotalCost *= data.duration || 1;
    return planTotalCost;
  }

  plansRatioForInvoice(plans: Plans[], data: CreateServiceInvoiceDto): number {
    let planTotalRatio = 1;
    let additionRatio;
    plans.forEach((element) => {
      data.plans.forEach((el) => {
        if (element.code == el && element.additionAmount == 0) {
          additionRatio = 1 + element.additionRatio;
          planTotalRatio *= additionRatio;
        }
      });
    });
    return planTotalRatio;
  }

  plansRatioForItems(plans: Plans[], data: CreateServiceInvoiceDto): number {
    let planTotalRatio = 1;
    let additionRatio;
    plans.forEach((element) => {
      data.plans.forEach((el) => {
        if (element.code == el && element.additionAmount != 0) {
          additionRatio = 1 + element.additionRatio;
          planTotalRatio *= additionRatio;
        }
      });
    });
    return planTotalRatio;
  }
}
