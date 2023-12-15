import { Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from '../crud/transactions-table/dto/create-transactions.dto';
import { TransactionsTableService } from '../crud/transactions-table/transactions-table.service';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { PaymentTypes } from '../crud/transactions-table/enum/payment-types.enum';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionTable: TransactionsTableService) {}

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
}
