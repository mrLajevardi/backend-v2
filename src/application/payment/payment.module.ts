import { Module } from '@nestjs/common';
import { ZarinpalService } from './zarinpal.service';
import { PaymentService } from './payment.service';

@Module({
  providers: [ZarinpalService, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
