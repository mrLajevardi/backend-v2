
import { Module } from '@nestjs/common';
import { ServiceInstancesTableService } from './service-instances-table.service';
//import { ServiceInstancesTableController } from './service-instances-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ServiceInstancesStoredProcedureService } from './service-instances-stored-procedure.service';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceInstancesTableService, ServiceInstancesStoredProcedureService],
  //controllers: [ServiceInstancesTableController],
  exports: [ServiceInstancesTableService, ServiceInstancesStoredProcedureService],
})
export class ServiceInstancesTableModule {}

			