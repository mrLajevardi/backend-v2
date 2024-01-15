import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { Injectable } from '@nestjs/common';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { BadRequestException } from '../../../../infrastructure/exceptions/bad-request.exception';
import { isNil } from 'lodash';
import { FindOptionsWhere, IsNull } from 'typeorm';
import { Invoices } from '../../../../infrastructure/database/entities/Invoices';
import { InvoicesService } from '../../invoice/service/invoices.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';

@Injectable()
export class UserInfoService {
  constructor(
    private transactionsTableService: TransactionsTableService,
    private readonly invoicesTableService: InvoicesTableService,
  ) {}

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

  async getInvoices(
    options: SessionRequest,
    page = 1,
    pageSize = 12,
    isPreInvoice = false,
    startDateTime?: Date,
    endDateTime?: Date,
  ): Promise<{
    data: Invoices[];
    total: number;
  }> {
    if (pageSize > 128) {
      throw new BadRequestException();
    }

    let dateFilter = false;
    if (!isNil(startDateTime) && !isNil(endDateTime)) {
      dateFilter = true;
    }

    const where: FindOptionsWhere<Invoices> = {
      userId: options.user.userId,
      isPreInvoice: isPreInvoice,
      // serviceInstanceId: IsNull(),
    };

    if (dateFilter) {
      where['DateTime'] = { $between: [startDateTime, endDateTime] };
    }
    console.log(Number((page - 1) * pageSize));
    const invoices: Invoices[] = await this.invoicesTableService.find({
      skip: Number((page - 1) * pageSize),
      take: pageSize,
      where,
      order: {
        dateTime: 'DESC',
      },
      relations: ['serviceInstance'],
    });

    const withOutPagination: number = await this.invoicesTableService.count({
      where,
    });

    return {
      data: invoices,
      total: withOutPagination,
    };
  }
}
