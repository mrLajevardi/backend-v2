import { Module } from '@nestjs/common';
import { InvoiceItemsTableService } from './invoice-items-table.service';
//import { InvoiceItemsTableController } from './invoice-items-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InvoiceItemsTableService],
  //controllers: [InvoiceItemsTableController],
  exports: [InvoiceItemsTableService],
})
export class InvoiceItemsTableModule {}
