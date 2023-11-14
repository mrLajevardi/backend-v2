import { Module } from '@nestjs/common';
import { DatacenterService } from './service/datacenter.service';
import { DatacenterController } from './datacenter.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { DatacenterTableModule } from '../crud/datacenter-table/datacenter-table.module';
import { DatacenterFactoryService } from './service/datacenter.factory.service';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { SessionsModule } from '../sessions/sessions.module';
import { BASE_DATACENTER_SERVICE } from './interface/datacenter.interface';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    DatacenterTableModule,
    MainWrapperModule,
    SessionsModule,
  ],
  providers: [
    {
      provide: BASE_DATACENTER_SERVICE,
      useClass: DatacenterService,
    },
    DatacenterFactoryService,
    DatacenterService,
  ],
  controllers: [DatacenterController],
  exports: [BASE_DATACENTER_SERVICE],
})
export class DatacenterModule {}
