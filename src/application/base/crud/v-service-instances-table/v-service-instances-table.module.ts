import { Module } from '@nestjs/common';

//import { ServiceInstancesTableController } from './service-instances-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { VServiceInstancesTableService } from './v-service-instances-table.service';

@Module({
  imports: [DatabaseModule],
  providers: [VServiceInstancesTableService],
  //controllers: [ServiceInstancesTableController],
  exports: [VServiceInstancesTableService],
})
export class VServiceInstancesTableModule {}
