
import { Module } from '@nestjs/common';
import { InvoicePlansTableService } from './invoice-plans-table.service';
//import { InvoicePlansTableController } from './invoice-plans-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InvoicePlansTableService],
  //controllers: [InvoicePlansTableController],
  exports: [InvoicePlansTableService],
})
export class InvoicePlansTableModule {}

			