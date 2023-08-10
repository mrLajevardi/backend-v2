import { Discounts } from "src/infrastructure/database/entities/Discounts";
import { ItemTypes } from "src/infrastructure/database/entities/ItemTypes";
import { Plans } from "src/infrastructure/database/entities/Plans";

class Costs {
  totalCosts  (
    data: any,
    discount: Discounts,
    plan: Plans,
    items: ItemTypes[],
    duration: number,
    bulitInDiscount: Discounts,
    costSerive?: number,
  ) : {rawAmount: number, finalAmount: number } {
    let itemCost = this.#itemCosts(items, data, duration);
    if (costSerive !== 0) {
      itemCost = costSerive;
    }
    const planCost = this.#planCost(plan, itemCost);
    let totalCost = planCost;
    if (bulitInDiscount) {
      const builtInDiscountCost = this.#discount(bulitInDiscount, totalCost);
      totalCost = builtInDiscountCost;
    }
    if (discount) {
      const discountCost = this.#discount(discount, totalCost);
      totalCost = discountCost;
    }
    return {
      rawAmount: itemCost,
      finalAmount: totalCost,
    };
  }

  totalCostsAi(
    cost: number,
    discount: Discounts,
    plan: Plans ,
    bulitInDiscount: Discounts ,
    duration: number,
  ) : { rawAmount: number, finalAmount: number} {
    cost = cost * duration;
    const planCost = this.#planCost(plan, cost);
    let totalCost = planCost;
    if (bulitInDiscount) {
      const builtInDiscountCost = this.#discount(bulitInDiscount, totalCost);
      totalCost = builtInDiscountCost;
    }
    if (discount) {
      const discountCost = this.#discount(discount, totalCost);
      totalCost = discountCost;
    }
    return {
      rawAmount: planCost,
      finalAmount: totalCost,
    };
  }

  #itemCosts(items: ItemTypes[] , data: any, duration: number) {
    let totalCost = 0;
    for (const itemKey of Object.keys(items)) {
      const item : ItemTypes = items[itemKey];
      const itemTitle = item.title;
      const itemQuantity = data[itemTitle];
      totalCost += itemQuantity * item.fee;
    }
    totalCost = totalCost * duration;
    return totalCost;
  }

  #planCost(plan: Plans, itemCost: number) : number {
    const additionalRatio = itemCost * plan.additionRatio;
    const additionalAmount = itemCost * plan.additionAmount;
    const totalCost = additionalRatio + additionalAmount + itemCost;
    return totalCost;
  }

  #discount(discount: Discounts, planCost: number) {
    let additionalRatio = planCost * discount.ratio;
    let additionalAmount = planCost * discount.amount;
    const discountSum = additionalAmount + additionalRatio;
    if (discountSum > planCost) {
      additionalRatio = 0;
      additionalAmount = 0;
    }
    const totalCost = planCost - discountSum;
    return totalCost;
  }
}

export default Costs;
