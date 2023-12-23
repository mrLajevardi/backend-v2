import { Module } from '@nestjs/common';
import { ServiceDiscountTableService } from './service-discount-table-service.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceDiscountTableService],
  exports: [ServiceDiscountTableService],
})
export class ServiceDiscountTableModule {}
