import { Transactions } from '../../../../../infrastructure/database/entities/Transactions';
import { isNil } from 'lodash';
import { User } from '../../../../../infrastructure/database/entities/User';

export class TransactionResultDtoFormat {
  id: number;
  user?: object;
  invoice?: object;
  type?: object;
  dateTime: Date;
  value: number;
  before: object;
  after: object;
}
export class TransactionsResultDto {
  collection(data: Transactions[]) {
    return data.map((item: Transactions) => {
      return this.toArray(item);
    });
  }
  toArray(item: Transactions) {
    return {
      id: item.id,
      user: !isNil(item.user) ? this.getUser(item.user) : null,
      // invoice : !isNil(item.invoice)
    };
  }

  getUser(user: User) {
    return {
      name: user.name,
      family: user.family,
    };
  }
}
