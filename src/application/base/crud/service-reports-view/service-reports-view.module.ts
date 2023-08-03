import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ServiceReportsViewService } from './service-reports-view.service';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceReportsViewService],
  exports: [ServiceReportsViewService],
})
export class ServiceReportsViewModule {}
