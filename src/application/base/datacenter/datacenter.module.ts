import { Module, forwardRef } from '@nestjs/common';
import { DatacenterService } from './service/datacenter.service';
import { DatacenterController } from './datacenter.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { DatacenterTableModule } from '../crud/datacenter-table/datacenter-table.module';
import { DatacenterFactoryService } from './service/datacenter.factory.service';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { SessionsModule } from '../sessions/sessions.module';
import { BASE_DATACENTER_SERVICE } from './interface/datacenter.interface';
import { DatacenterAdminService } from './service/datacenter.admin.service';
import { InvoicesModule } from '../invoice/invoices.module';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    DatacenterTableModule,
    MainWrapperModule,
    SessionsModule,
    forwardRef(() => InvoicesModule),
  ],
  providers: [
    {
      provide: BASE_DATACENTER_SERVICE,
      useClass: DatacenterService,
    },
    DatacenterFactoryService,
    DatacenterAdminService,
  ],
  controllers: [DatacenterController],
  exports: [BASE_DATACENTER_SERVICE],
})
export class DatacenterModule {}
