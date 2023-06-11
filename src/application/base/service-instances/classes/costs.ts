class Costs {
  totalCosts(
    data: any,
    discount: any,
    plan: any,
    items: any,
    duration: number,
    bulitInDiscount: any,
    costSerive?: number,
  ) {
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
    discount: any,
    plan: any,
    bulitInDiscount: any,
    duration: number,
  ) {
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

  #itemCosts(items: any, data: any, duration: number) {
    let totalCost = 0;
    for (const item of Object.keys(items)) {
      const itemTitle = items[item].Title;
      const itemQuantity = data[itemTitle];
      totalCost += itemQuantity * items[item].Fee;
    }
    totalCost = totalCost * duration;
    return totalCost;
  }

  #planCost(plan: any, itemCost: number) {
    const additionalRatio = itemCost * plan.AdditionRatio;
    const additionalAmount = itemCost * plan.AdditionAmount;
    const totalCost = additionalRatio + additionalAmount + itemCost;
    return totalCost;
  }

  #discount(discount: any, planCost: number) {
    let additionalRatio = planCost * discount.Ratio;
    let additionalAmount = planCost * discount.Amount;
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
