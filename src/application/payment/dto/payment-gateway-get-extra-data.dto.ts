import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { PaymentGatewayTypeEnum } from '../enum/payment-gateway-type.enum';

export class PaymentGatewayGetExtraDataDto {
  @ApiProperty({
    type: Number,
  })
  invoiceId?: number = null;

  @ApiProperty({
    type: String,
  })
  serviceInstanceId?: string = null;
}
