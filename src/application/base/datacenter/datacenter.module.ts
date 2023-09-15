import { Module } from '@nestjs/common';
import { DatacenterService } from './service/datacenter.service';
import { DatacenterController } from './datacenter.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { DatacenterTableModule } from '../crud/datacenter-table/datacenter-table.module';
@Module({
  imports: [DatabaseModule, CrudModule, DatacenterTableModule],
  providers: [
    {
      provide: 'IDatacenterService',
      useClass: DatacenterService,
    },
  ],
  controllers: [DatacenterController],
})
export class DatacenterModule {}
