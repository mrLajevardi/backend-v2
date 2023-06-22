import { Injectable } from '@nestjs/common';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';

@Injectable()
export class DiscountsService {
  constructor(private readonly discountsTable: DiscountsTableService) {}

  // Moved from createService.js
  async findBuiltInDiscount(duration) {
    const builtInDiscounts = [
      {
        duration: 3,
        builtInDiscountCode: 'threeMonthPeriod',
      },
      {
        duration: 6,
        builtInDiscountCode: 'sixMonthPeriod',
      },
    ];
    for (const discount of builtInDiscounts) {
      if (discount.duration === duration) {
        const builtInDiscount = await this.discountsTable.findOne({
          where: {
            code: discount.builtInDiscountCode,
          },
        });
        return Promise.resolve(builtInDiscount);
      }
    }
    return null;
  }
}
