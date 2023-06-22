import { Injectable } from '@nestjs/common';

@Injectable()
export class CostCalculationService {
  totalCosts(serviceType, data, plans, items) {
    const totalCost =
      (this.itemsCost(items, data, serviceType) *
        this.plansRatioForItems(plans, data) +
        this.plansCost(plans, data)) *
      this.plansRatioForInvoice(plans, data);
    return totalCost;
  }

  itemsCost(items, data, serviceType) {
    let itemTotalCost = 0;
    if (!serviceType.IsPAYG) {
      items.forEach((element) => {
        data.items.forEach((el) => {
          if (el.itemCode == element.Title) {
            itemTotalCost += el.quantity * element.Fee;
          }
        });
      });
    }
    itemTotalCost *= data.duration || 1;
    return itemTotalCost;
  }

  plansCost(plans, data) {
    let planTotalCost = 0;
    plans.forEach((element) => {
      data.plans.forEach((el) => {
        if (element.Code == el) {
          planTotalCost += element.AdditionAmount;
        }
      });
    });
    planTotalCost *= data.duration || 1;
    return planTotalCost;
  }

  plansRatioForInvoice(plans, data) {
    let planTotalRatio = 1;
    let additionRatio;
    plans.forEach((element) => {
      data.plans.forEach((el) => {
        if (element.Code == el && element.AdditionAmount == 0) {
          additionRatio = 1 + element.AdditionRatio;
          planTotalRatio *= additionRatio;
        }
      });
    });
    return planTotalRatio;
  }

  plansRatioForItems(plans, data) {
    let planTotalRatio = 1;
    let additionRatio;
    plans.forEach((element) => {
      data.plans.forEach((el) => {
        if (element.Code == el && element.AdditionAmount != 0) {
          additionRatio = 1 + element.AdditionRatio;
          planTotalRatio *= additionRatio;
        }
      });
    });
    return planTotalRatio;
  }
}
