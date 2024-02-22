import { PaymentGatewayStrategyInterface } from './interface/payment-gateway-strategy.interface';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { UserService } from '../../base/user/service/user.service';
import { User } from '../../../infrastructure/database/entities/User';
import { ZarinpalConfigDto } from '../dto/zarinpal-config.dto';
import * as process from 'process';
import { PaymentGatewayGetDataResultDto } from '../dto/payment-gateway-get-data.result.dto';
import { BaseFactoryException } from '../../../infrastructure/exceptions/base/base-factory.exception';
import { PaymentGatewayException } from '../../../infrastructure/exceptions/payment-gateway.exception';
import { PaymentGatewayTypeEnum } from '../enum/payment-gateway-type.enum';
import { TransactionsTableService } from '../../base/crud/transactions-table/transactions-table.service';
import { CreateTransactionsDto } from '../../base/crud/transactions-table/dto/create-transactions.dto';
import { PaymentTypes } from '../../base/crud/transactions-table/enum/payment-types.enum';
import { PaymentGatewayGetExtraDataDto } from '../dto/payment-gateway-get-extra-data.dto';
import { Transactions } from '../../../infrastructure/database/entities/Transactions';
import { isNil } from 'lodash';
import { NotFoundDataException } from '../../../infrastructure/exceptions/not-found-data-exception';
import axios from 'axios';

export class PaymentZarinPalStrategy
  implements PaymentGatewayStrategyInterface
{
  constructor(
    private readonly userService: UserService,
    private readonly baseFactoryException: BaseFactoryException,
    private readonly transactionsTableService: TransactionsTableService,
  ) {}

  paymentGatewayType: PaymentGatewayTypeEnum = PaymentGatewayTypeEnum.ZarinPal;

  private merchantID: string = process.env.ZARINPAL_MERCHANT_ID;

  getGateWayConfig(user?: User): ZarinpalConfigDto {
    return {
      email: user?.email ?? null,
      mobile: user?.phoneNumber ?? null,
      callback_url: process.env.ZARINPAL_CALLBACK_URL,
      description: process.env.ZARINPAL_DESCRIPTION,
      merchant_id: this.merchantID,
    };
  }

  async getUser(options: SessionRequest): Promise<User> {
    return await this.userService.findById(options.user.userId);
  }

  public async paymentRequest(
    options: SessionRequest,
    amount: number,
    insertTransaction = true,
    externalData?: PaymentGatewayGetExtraDataDto,
  ): Promise<PaymentGatewayGetDataResultDto> {
    const user: User = await this.getUser(options);
    let authorityCode: string;
    const data: ZarinpalConfigDto = {
      ...this.getGateWayConfig(user),
      amount,
    };
    await axios
      .post('https://api.zarinpal.com/pg/v4/payment/request.json', data)
      .then((res) => {
        authorityCode = res.data.data.authority;
      })
      .catch((err) => {
        console.log('<zarin_pal_catch>', err);
        this.baseFactoryException.handle(PaymentGatewayException);
      });

    if (insertTransaction) {
      const transactionsDto: CreateTransactionsDto = {
        userId: user.id.toString(),
        dateTime: new Date(),
        value: amount,
        ...externalData,
        description: 'INC',
        paymentType: PaymentTypes.PayByPaymentGateway,
        paymentToken: authorityCode,
        isApproved: false,
        paymentGatewayType: this.paymentGatewayType,
      };

      await this.transactionsTableService.create(transactionsDto);
    }

    return {
      paymentGateWayType: PaymentGatewayTypeEnum.ZarinPal,
      token: authorityCode,
      redirectUrl: 'https://www.zarinpal.com/pg/StartPay/' + authorityCode,
    };
  }

  public async paymentVerify(
    options: SessionRequest,
    paymentToken: string,
  ): Promise<Transactions> {
    const user: User = await this.getUser(options);

    const transaction: Transactions =
      await this.transactionsTableService.findOne({
        where: {
          paymentToken: paymentToken,
          userId: user.id,
          paymentType: PaymentTypes.PayByPaymentGateway,
          paymentGatewayType: this.paymentGatewayType,
        },
      });

    if (isNil(transaction)) {
      this.baseFactoryException.handle(NotFoundDataException);
    }

    const paymentGatewayRequestData = {
      merchant_id: this.merchantID,
      amount: transaction.value,
      authority: paymentToken,
    };
    let verified = false;
    let refID = null;
    let metaData: string;

    await axios
      .post(
        'https://api.zarinpal.com/pg/v4/payment/verify.json',
        paymentGatewayRequestData,
      )
      .then((res) => {
        console.log('before if res of zarinpal ==>', res);
        if (
          (res.data?.data?.message === 'Verified' ||
            res.data?.data?.message === 'Paid') &&
          (res.data?.data?.code === 100 || res.data?.data?.code === 101)
        ) {
          verified = true;
          refID = res.data?.data?.ref_id ?? null;
          metaData = res.data?.data ?? null;
        }
      })
      .catch((err) => {
        console.log('<zarin_pal_verify_catch>', err);
        this.baseFactoryException.handle(PaymentGatewayException);
      });

    if (!transaction.isApproved) {
      await this.transactionsTableService.update(transaction.id, {
        isApproved: verified,
        refId: refID,
        metaData: JSON.stringify(metaData),
      });
    }

    return await this.transactionsTableService.findById(transaction.id);
  }
}
