import { Module } from '@nestjs/common';

//import { ServiceInstancesTableController } from './service-instances-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { VServiceInstancesDetailTableService } from './v-service-instances-detail-table.service';

@Module({
  imports: [DatabaseModule],
  providers: [VServiceInstancesDetailTableService],
  //controllers: [ServiceInstancesTableController],
  exports: [VServiceInstancesDetailTableService],
})
export class VServiceInstancesDetailTableModule {}
