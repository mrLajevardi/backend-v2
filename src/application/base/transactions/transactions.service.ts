import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { CreateTransactionsDto } from '../crud/transactions-table/dto/create-transactions.dto';
import { TransactionsTableService } from '../crud/transactions-table/transactions-table.service';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { FindOptionsWhere } from 'typeorm';

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

  // async getOwnUser(
  //     options: SessionRequest,
  //     page: number,
  //     pageSize: number,
  //     startDateTime: Date,
  //     endDateTime: Date,
  // ) {
  //     if (pageSize > 128) {
  //         throw new BadRequestException();
  //     }
  //
  //     let where: FindOptionsWhere<Transactions> = {
  //       userId
  //     };
  //
  //
  //
  // }
}
