import { Module } from '@nestjs/common';
import { ServiceItemsSumService } from './service-items-sum.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceItemsSumService],
  exports: [ServiceItemsSumService],
})
export class ServiceItemsSumModule {}
