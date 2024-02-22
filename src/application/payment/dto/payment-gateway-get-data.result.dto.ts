import { ApiResponseProperty } from '@nestjs/swagger';
import { PaymentGatewayTypeEnum } from '../enum/payment-gateway-type.enum';

export class PaymentGatewayGetDataResultDto {
  @ApiResponseProperty({
    type: PaymentGatewayTypeEnum,
    enum: PaymentGatewayTypeEnum,
  })
  paymentGateWayType: PaymentGatewayTypeEnum;

  @ApiResponseProperty({
    type: String,
  })
  redirectUrl: string;

  @ApiResponseProperty({
    type: String,
  })
  token: string;
}
