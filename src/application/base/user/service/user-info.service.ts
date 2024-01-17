import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { Injectable } from '@nestjs/common';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { BadRequestException } from '../../../../infrastructure/exceptions/bad-request.exception';
import { isNil } from 'lodash';
import { FindOptionsWhere, IsNull } from 'typeorm';
import { Invoices } from '../../../../infrastructure/database/entities/Invoices';
import { InvoicesService } from '../../invoice/service/invoices.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { ChangePhoneNumberDto } from '../../security/auth/dto/change-phone-number.dto';
import { OtpNotMatchException } from '../../../../infrastructure/exceptions/otp-not-match-exception';
import { SecurityToolsService } from '../../security/security-tools/security-tools.service';
import { RedisCacheService } from '../../../../infrastructure/utils/services/redis-cache.service';
import { LoginService } from '../../security/auth/service/login.service';
import { PhoneNumberHashResultDto } from '../dto/results/phone-number-hash.result.dto';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { User } from '../../../../infrastructure/database/entities/User';
import { ForbiddenException } from '../../../../infrastructure/exceptions/forbidden.exception';

@Injectable()
export class UserInfoService {
  constructor(
    private transactionsTableService: TransactionsTableService,
    private readonly invoicesTableService: InvoicesTableService,
    private readonly securityToolsService: SecurityToolsService,
    private readonly redisCacheService: RedisCacheService,
    private readonly loginService: LoginService,
    private readonly userTableService: UserTableService,
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

  async changePhoneNumberOldNumberVerifyOtp(
    options: SessionRequest,
    data: ChangePhoneNumberDto,
  ): Promise<PhoneNumberHashResultDto> {
    const user: User = await this.userTableService.findById(
      options.user.userId,
    );

    if (user.phoneNumber != data.oldPhoneNumber) {
      throw new ForbiddenException();
    }

    if (user.phoneNumber == data.newPhoneNumber) {
      throw new BadRequestException();
    }

    const verify: boolean = this.securityToolsService.otp.otpVerifier(
      data.oldPhoneNumber,
      data.otp,
      data.hash,
    );

    if (!verify) {
      throw new OtpNotMatchException();
    }

    const cacheKey: string = options.user.userId + '_changePhoneNumber';
    await this.redisCacheService.set(cacheKey, data.oldPhoneNumber, 480000);

    const otp = await this.loginService.generateOtp(data.newPhoneNumber);

    return {
      phoneNumber: data.newPhoneNumber,
      hash: otp.hash,
    };
  }
}
