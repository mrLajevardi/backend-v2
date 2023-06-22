
import { Module } from '@nestjs/common';
import { InvoicesTableService } from './invoices-table.service';
//import { InvoicesTableController } from './invoices-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { InvoicesQueryService } from './invoices-query.service';

@Module({
  imports: [DatabaseModule],
  providers: [InvoicesTableService, InvoicesQueryService],
  //controllers: [InvoicesTableController],
  exports: [InvoicesTableService],
})
export class InvoicesTableModule {}

			