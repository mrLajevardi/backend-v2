import { Injectable } from '@nestjs/common';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { Discounts } from 'src/infrastructure/database/entities/Discounts';

@Injectable()
export class DiscountsService {
  constructor(private readonly discountsTable: DiscountsTableService) {}

  // Moved from createService.js
  async findBuiltInDiscount(duration) : Promise<Discounts | null>  {
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
