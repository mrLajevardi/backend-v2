import { Injectable } from '@nestjs/common';
import { ZarinpalService } from './zarinpal.service';
import { PaymentGatewayStrategy } from './classes/payment-gateway.strategy';
import { PaymentZarinPalStrategy } from './classes/payment-zarin-pal.strategy';
import { PaymentOmidPayStrategy } from './classes/payment-omid-pay.strategy';
import { PaymentGatewayTypeEnum } from './enum/payment-gateway-type.enum';
import { SessionRequest } from '../../infrastructure/types/session-request.type';
import { PaymentGatewayGetExtraDataDto } from './dto/payment-gateway-get-extra-data.dto';
import { PaymentGatewayGetDataResultDto } from './dto/payment-gateway-get-data.result.dto';
import { Transactions } from '../../infrastructure/database/entities/Transactions';

@Injectable()
export class PaymentService {
  constructor(
    public readonly zarinpal: ZarinpalService,
    private readonly paymentGatewayStrategy: PaymentGatewayStrategy,
    private readonly paymentZarinPalStrategy: PaymentZarinPalStrategy,
    private readonly paymentOmidPayStrategy: PaymentOmidPayStrategy,
  ) {}

  private dictionary = {
    [PaymentGatewayTypeEnum.ZarinPal]: this.paymentZarinPalStrategy,
    [PaymentGatewayTypeEnum.OmidPay]: this.paymentOmidPayStrategy,
  };

  public async paymentRequest(
    options: SessionRequest,
    gatewayType: PaymentGatewayTypeEnum,
    amount: number,
    externalData?: PaymentGatewayGetExtraDataDto,
  ): Promise<PaymentGatewayGetDataResultDto> {
    this.paymentGatewayStrategy.setStrategy(this.dictionary[gatewayType]);

    return this.paymentGatewayStrategy.paymentRequest(
      options,
      amount,
      true,
      externalData,
    );
  }

  public async paymentVerify(
    options: SessionRequest,
    gatewayType: PaymentGatewayTypeEnum,
    paymentToken: string,
  ): Promise<Transactions> {
    this.paymentGatewayStrategy.setStrategy(this.dictionary[gatewayType]);

    return this.paymentGatewayStrategy.paymentVerify(options, paymentToken);
  }
}
