import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { InvoiceItemListService } from './invoice-item-list.service';

@Module({
  imports: [DatabaseModule],
  providers: [InvoiceItemListService],
  exports: [InvoiceItemListService],
})
export class InvoiceItemListModule {}
