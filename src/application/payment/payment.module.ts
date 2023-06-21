import { Module } from '@nestjs/common';
import { ZarinpalService } from './zarinpal.service';

@Module({
  providers: [ZarinpalService],
})
export class PaymentModule {}
