import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from '../crud/transactions-table/dto/create-transactions.dto';
import { TransactionsTableService } from '../crud/transactions-table/transactions-table.service';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { PaymentTypes } from '../crud/transactions-table/enum/payment-types.enum';
import { ChangeUserCreditDto } from './dto/change-user-credit.dto';
import { User } from '../../../infrastructure/database/entities/User';
import { UserService } from '../user/service/user.service';
import { UserInfoService } from '../user/service/user-info.service';
import { TransactionAmountTypeEnum } from './enum/transaction-amount-type.enum';
import { isNil } from 'lodash';
import { NotFoundException } from '../../../infrastructure/exceptions/not-found.exception';
import { UserTableService } from '../crud/user-table/user-table.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionTable: TransactionsTableService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  // Moved from createService
  async createTransaction(
    value: number,
    invoiceId: number,
    description: string,
    userId: string,
  ): Promise<Transactions> {
    let dto: CreateTransactionsDto;
    dto.userId = userId;
    dto.dateTime = new Date();
    dto.value = value;
    dto.invoiceId = invoiceId;
    dto.description = description;
    return await this.transactionTable.create(dto);
  }

  async create(
    userId: number,
    type: PaymentTypes,
    value: number,
    serviceInstanceId?: string,
    description?: string,
  ) {
    const transaction = await this.transactionTable.create({
      userId: userId.toString(),
      value: value,
      paymentType: type,
      isApproved: true,
      dateTime: new Date(),
      serviceInstanceId,
      description,
    });
    console.log(transaction);

    return transaction;
  }

  async changeUserCredit(
    userId: number,
    dto: ChangeUserCreditDto,
  ): Promise<Transactions> {
    const user: User = await this.userService.findById(userId);
    if (isNil(user)) {
      throw new NotFoundException();
    }

    const value =
      dto.amount *
      (dto.transactionType == TransactionAmountTypeEnum.decrease ? -1 : 1);
    const createTransactionDto: CreateTransactionsDto = {
      userId: userId.toString(),
      value: value,
      dateTime: new Date(),
      isApproved: true,
      paymentType: PaymentTypes.PayToUserCreditByAdmin,
    };

    return await this.transactionTable.create(createTransactionDto);
  }
}
