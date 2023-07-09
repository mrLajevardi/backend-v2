import { Module } from '@nestjs/common';
import { ServicePlansTableService } from './service-plans-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServicePlansTableService],
  //controllers: [InvoicePlansTableController],
  exports: [ServicePlansTableService],
})
export class ServicePlansTableModule {}
