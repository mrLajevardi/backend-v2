
import { Module } from '@nestjs/common';
import { InvoiceDiscountsTableService } from './invoice-discounts-table.service';
//import { InvoiceDiscountsTableController } from './invoice-discounts-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InvoiceDiscountsTableService],
  //controllers: [InvoiceDiscountsTableController],
  exports: [InvoiceDiscountsTableService],
})
export class InvoiceDiscountsTableModule {}

			