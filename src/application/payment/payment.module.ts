import { Module } from '@nestjs/common';
import { ZarinpalService } from './zarinpal.service';
import { PaymentService } from './payment.service';
import { PaymentGatewayStrategy } from './classes/payment-gateway.strategy';
import { PaymentZarinPalStrategy } from './classes/payment-zarin-pal.strategy';
import { PaymentOmidPayStrategy } from './classes/payment-omid-pay.strategy';

@Module({
  providers: [
    ZarinpalService,
    PaymentService,
    PaymentGatewayStrategy,
    PaymentZarinPalStrategy,
    PaymentOmidPayStrategy,
  ],
  exports: [PaymentService, ZarinpalService],
})
export class PaymentModule {}
