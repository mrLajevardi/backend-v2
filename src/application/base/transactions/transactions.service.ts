import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateTransactionsDto } from '../crud/transactions-table/dto/create-transactions.dto';
import { TransactionsTableService } from '../crud/transactions-table/transactions-table.service';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { PaymentTypes } from '../crud/transactions-table/enum/payment-types.enum';
import { ChangeUserCreditDto } from './dto/change-user-credit.dto';
import { User } from '../../../infrastructure/database/entities/User';
import { UserService } from '../user/service/user.service';
import { TransactionAmountTypeEnum } from './enum/transaction-amount-type.enum';
import { isNil } from 'lodash';
import { NotFoundException } from '../../../infrastructure/exceptions/not-found.exception';
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Like,
} from 'typeorm';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';
import { PaginationReturnDto } from '../../../infrastructure/dto/pagination-return.dto';
import { UnprocessableEntity } from '../../../infrastructure/exceptions/unprocessable-entity.exception';
import { SystemSettingsTableService } from '../crud/system-settings-table/system-settings-table.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionTable: TransactionsTableService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly systemSettingsTable: SystemSettingsTableService,
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

    const settings = await this.systemSettingsTable.find({
      where: {
        propertyKey: Like('%credit.%'),
      },
    });

    const filteredSettings = {};
    settings.forEach((setting) => {
      filteredSettings[setting.propertyKey] = setting.value;
    });
    const { amount } = dto;

    if (
      amount < filteredSettings['credit.minValue'] ||
      amount > filteredSettings['credit.maxValue']
    ) {
      return Promise.reject(new UnprocessableEntity());
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

  async paginate(
    page: number,
    pageSize: number,
    where: FindOptionsWhere<Transactions>,
    startDateTime?: Date | null,
    endDateTime?: Date | null,
  ): Promise<PaginationReturnDto<Transactions>> {
    if (pageSize > 128) {
      return Promise.reject(new BadRequestException());
    }

    if (startDateTime && !endDateTime) {
      endDateTime = new Date();
    }

    if (startDateTime && endDateTime) {
      where['DateTime'] = { $between: [startDateTime, endDateTime] };
    }

    const orderBy: FindOptionsOrder<Transactions> = {
      dateTime: 'DESC',
    };
    const relations: FindOptionsRelations<Transactions> = [
      'invoice',
      'serviceInstance',
      'user',
    ] as FindOptionsRelations<Transactions>;

    return await this.transactionTable.paginate(
      page,
      pageSize,
      where,
      orderBy,
      relations,
    );
  }
}
