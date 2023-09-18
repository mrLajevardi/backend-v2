import { Module } from '@nestjs/common';
import { DatacenterService } from './service/datacenter.service';
import { DatacenterController } from './datacenter.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { DatacenterTableModule } from '../crud/datacenter-table/datacenter-table.module';
import { DatacenterFactoryService } from './service/datacenter.factory.service';
@Module({
  imports: [DatabaseModule, CrudModule, DatacenterTableModule],
  providers: [
    {
      provide: 'IDatacenterService',
      useClass: DatacenterService,
    },
    DatacenterFactoryService,
  ],
  controllers: [DatacenterController],
})
export class DatacenterModule {}
