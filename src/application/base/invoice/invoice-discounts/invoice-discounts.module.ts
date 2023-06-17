import { Module } from '@nestjs/common';
import { InvoiceDiscountsService } from './invoice-discounts.service';
import { InvoiceDiscountsController } from './invoice-discounts.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InvoiceDiscountsService],
  controllers: [InvoiceDiscountsController],
  exports: [InvoiceDiscountsService]
})
export class InvoiceDiscountsModule {}
