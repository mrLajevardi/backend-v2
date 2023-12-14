import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserInfoService {
  constructor(private transactionsTableService: TransactionsTableService) {}
  async getUserCreditBy(userId: number): Promise<number> {
    const tran = await this.transactionsTableService
      .getQueryBuilder()
      .select('SUM(transactions.Value)', 'Credit')
      .where(`transactions.UserID= :userId AND transactions.isApproved = 1 `, {
        userId,
      })
      .getRawOne();
    return tran.Credit;
  }
}
