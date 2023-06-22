
import { Module } from '@nestjs/common';
import { InvoicePropertiesTableService } from './invoice-properties-table.service';
//import { InvoicePropertiesTableController } from './invoice-properties-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InvoicePropertiesTableService],
  //controllers: [InvoicePropertiesTableController],
  exports: [InvoicePropertiesTableService],
})
export class InvoicePropertiesTableModule {}

			