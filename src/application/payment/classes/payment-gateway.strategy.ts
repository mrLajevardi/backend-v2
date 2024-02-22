import { PaymentGatewayStrategyInterface } from './interface/payment-gateway-strategy.interface';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { PaymentGatewayGetExtraDataDto } from '../dto/payment-gateway-get-extra-data.dto';
import { PaymentGatewayGetDataResultDto } from '../dto/payment-gateway-get-data.result.dto';
import { TransactionsService } from '../../base/transactions/transactions.service';
import { Transactions } from '../../../infrastructure/database/entities/Transactions';

export class PaymentGatewayStrategy {
  constructor(private readonly transactionsService: TransactionsService) {}

  private strategy: PaymentGatewayStrategyInterface;

  public setStrategy(strategy: PaymentGatewayStrategyInterface) {
    this.strategy = strategy;
  }

  public async paymentRequest(
    options: SessionRequest,
    amount: number,
    insertTransaction = true,
    externalData?: PaymentGatewayGetExtraDataDto,
  ): Promise<PaymentGatewayGetDataResultDto> {
    await this.transactionsService.validateCreditAmount(amount);
    return await this.strategy.paymentRequest(
      options,
      amount,
      insertTransaction,
      externalData,
    );
  }

  public async paymentVerify(
    options: SessionRequest,
    paymentToken: string,
  ): Promise<Transactions> {
    return await this.strategy.paymentVerify(options, paymentToken);
  }
}
