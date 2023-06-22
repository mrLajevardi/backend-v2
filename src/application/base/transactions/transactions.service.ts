import { Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from '../crud/transactions-table/dto/create-transactions.dto';
import { TransactionsTableService } from '../crud/transactions-table/transactions-table.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionTable: TransactionsTableService) {}

  // Moved from createService
  async createTransaction(
    value: string,
    invoiceId: number,
    description: string,
    userId: string,
  ) {
    let dto: CreateTransactionsDto;
    dto.userId = userId;
    dto.dateTime = new Date();
    dto.value = invoiceId;
    dto.description = description;
    await this.transactionTable.create(dto);
  }
}
