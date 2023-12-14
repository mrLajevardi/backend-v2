import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';
import { ServicePaymentsTableService } from './service-payments-table.service';

@Module({
  imports: [DatabaseModule],
  providers: [ServicePaymentsTableService],
  exports: [ServicePaymentsTableService],
})
export class ServicePaymentsTableModule {}
