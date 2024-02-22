import { PaymentGatewayStrategyInterface } from './interface/payment-gateway-strategy.interface';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { PaymentGatewayGetExtraDataDto } from '../dto/payment-gateway-get-extra-data.dto';
import { PaymentGatewayGetDataResultDto } from '../dto/payment-gateway-get-data.result.dto';
import { PaymentGatewayTypeEnum } from '../enum/payment-gateway-type.enum';
import { Transactions } from '../../../infrastructure/database/entities/Transactions';
import { UserService } from '../../base/user/service/user.service';
import { BaseFactoryException } from '../../../infrastructure/exceptions/base/base-factory.exception';
import { TransactionsTableService } from '../../base/crud/transactions-table/transactions-table.service';
import { User } from '../../../infrastructure/database/entities/User';
import * as process from 'process';
import { OmidPayConfigDto } from '../dto/omid-pay-config.dto';
import { PaymentGatewayException } from '../../../infrastructure/exceptions/payment-gateway.exception';
import { CreateTransactionsDto } from '../../base/crud/transactions-table/dto/create-transactions.dto';
import { PaymentTypes } from '../../base/crud/transactions-table/enum/payment-types.enum';
import { assignWith, isNil } from 'lodash';
import { NotFoundDataException } from '../../../infrastructure/exceptions/not-found-data-exception';
import axios from 'axios';

export class PaymentOmidPayStrategy implements PaymentGatewayStrategyInterface {
  constructor(
    private readonly userService: UserService,
    private readonly baseFactoryException: BaseFactoryException,
    private readonly transactionsTableService: TransactionsTableService,
  ) {}

  paymentGatewayType: PaymentGatewayTypeEnum = PaymentGatewayTypeEnum.OmidPay;

  getGateWayConfig(user?: User): any {
    return {
      userId: process.env.OMID_PAY_MERCHANT_ID,
      password: process.env.OMID_PAY_PASSWORD,
      transType: 'EN_GOODS',
      redirectUrl: `https://${process.env.HOST}:${process.env.PORT}/${process.env.OMID_PAY_REDIRECT_URL}`,
    };
  }

  async getUser(options: SessionRequest): Promise<User> {
    return await this.userService.findById(options.user.userId);
  }

  async paymentRequest(
    options: SessionRequest,
    amount: number,
    insertTransaction = true,
    externalData?: PaymentGatewayGetExtraDataDto,
  ): Promise<PaymentGatewayGetDataResultDto> {
    const gatewayConfig = this.getGateWayConfig();
    const user: User = await this.getUser(options);
    console.log(insertTransaction);
    const transactionsDto: CreateTransactionsDto = {
      userId: user.id.toString(),
      dateTime: new Date(),
      value: amount,
      ...externalData,
      description: 'INC',
      paymentType: PaymentTypes.PayByPaymentGateway,
      paymentToken: null,
      isApproved: false,
      paymentGatewayType: this.paymentGatewayType,
    };

    const transactions = await this.transactionsTableService.create(
      transactionsDto,
    );

    const _data: OmidPayConfigDto = {
      WSContext: {
        UserId: gatewayConfig.userId,
        Password: gatewayConfig.password,
      },
      TransType: gatewayConfig.TransType,
      ReserveNum: transactions.guid,
      MerchantId: gatewayConfig.MerchantId,
      Amount: amount.toString(),
      RedirectUrl: gatewayConfig.redirectUrl,
    };

    const axiosConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://ref.sayancard.ir/ref-payment/RestServices/mts/generateTokenWithNoSign/',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(_data),
    };

    let paymentToken = null;

    await axios
      .request(axiosConfig)
      .then((response) => {
        console.log('<omid_pay_payment_request>', response.data);
        paymentToken = response.data.Token;
      })
      .catch(async (error) => {
        console.log('<omid_pay_payment_request_catch>', error);
        await this.transactionsTableService.delete(transactions.id);
        this.baseFactoryException.handle(PaymentGatewayException);
      });

    await this.transactionsTableService.update(transactions.id, {
      paymentToken: paymentToken,
    });

    return {
      paymentGateWayType: PaymentGatewayTypeEnum.OmidPay,
      token: paymentToken,
      redirectUrl: null,
    };
  }

  async paymentVerify(
    options: SessionRequest,
    transactionGuid: string,
  ): Promise<Transactions> {
    const user: User = await this.getUser(options);
    const gatewayConfig = this.getGateWayConfig();

    const transaction: Transactions =
      await this.transactionsTableService.findOne({
        where: {
          guid: transactionGuid,
          userId: user.id,
          paymentType: PaymentTypes.PayByPaymentGateway,
          paymentGatewayType: this.paymentGatewayType,
        },
      });

    if (isNil(transaction)) {
      this.baseFactoryException.handle(NotFoundDataException);
    }

    const _data: OmidPayConfigDto = {
      WSContext: {
        UserId: gatewayConfig.userId,
        Password: gatewayConfig.password,
      },
      RefNum: transactionGuid,
      Token: transaction.paymentToken,
    };

    const axiosConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://ref.sayancard.ir/ref-payment/RestServices/mts/verifyMerchantTrans/',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(_data),
    };

    await axios
      .request(axiosConfig)
      .then(async (response) => {
        console.log('<omid_pay_payment_verify>', response.data);
        if (
          response.data.Result === 'erSucceed' &&
          response.data.Amount == transaction.value
        ) {
          await this.transactionsTableService.update(transaction.id, {
            isApproved: true,
          });
        } else {
          this.baseFactoryException.handle(PaymentGatewayException);
        }
      })
      .catch(async (error) => {
        console.log('<omid_pay_payment_verify_catch>', error);
        this.baseFactoryException.handle(PaymentGatewayException);
      });

    return await this.transactionsTableService.findById(transaction.id);
  }
}
