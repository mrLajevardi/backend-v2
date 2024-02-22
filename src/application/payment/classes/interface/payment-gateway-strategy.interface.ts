import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { PaymentGatewayGetDataResultDto } from '../../dto/payment-gateway-get-data.result.dto';
import { PaymentGatewayGetExtraDataDto } from '../../dto/payment-gateway-get-extra-data.dto';
import { Transactions } from '../../../../infrastructure/database/entities/Transactions';
import { PaymentGatewayTypeEnum } from '../../enum/payment-gateway-type.enum';
import { User } from '../../../../infrastructure/database/entities/User';
import { ZarinpalConfigDto } from '../../dto/zarinpal-config.dto';

export interface PaymentGatewayStrategyInterface {
  paymentGatewayType: PaymentGatewayTypeEnum;

  getUser(options: SessionRequest): Promise<User>;

  getGateWayConfig(user?: User): ZarinpalConfigDto;

  paymentRequest(
    options: SessionRequest,
    amount: number,
    insertTransaction: boolean,
    externalData?: PaymentGatewayGetExtraDataDto,
  ): Promise<PaymentGatewayGetDataResultDto>;

  paymentVerify(
    options: SessionRequest,
    paymentToken: string,
  ): Promise<Transactions>;
}
