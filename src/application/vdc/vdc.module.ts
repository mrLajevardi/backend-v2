import { Module, forwardRef } from '@nestjs/common';
import { VdcService } from './service/vdc.service';
import { OrgService } from './service/org.service';
import { EdgeService } from './service/edge.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TasksModule } from '../base/tasks/tasks.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { OrganizationModule } from '../base/organization/organization.module';
import { UserModule } from '../base/user/user.module';
import { VdcController } from './controller/vdc.controller';
import { VdcAdminController } from './controller/vdc-admin.controller';
import { CrudModule } from '../base/crud/crud.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { NetworkService } from './service/network.service';
import { ServicePropertiesModule } from '../base/service-properties/service-properties.module';
import { AbilityModule } from '../base/security/ability/ability.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { VdcFactoryService } from './service/vdc.factory.service';
import { InvoicesModule } from '../base/invoice/invoices.module';
import { BASE_VDC_INVOICE_SERVICE } from './interface/base-vdc-invoice-service.interface';
import { VdcInvoiceService } from './service/vdc-invoice.service';
import { ServiceModule } from '../base/service/service.module';

@Module({
  imports: [
    MainWrapperModule,
    DatabaseModule,
    CrudModule,
    LoggerModule,
    forwardRef(() => TasksModule),
    SessionsModule,
    forwardRef(() => InvoicesModule),
    forwardRef(() => ServiceModule),
    OrganizationModule,
    UserModule,
    ServicePropertiesModule,
    AbilityModule,
  ],
  providers: [
    VdcService,
    OrgService,
    EdgeService,
    NetworkService,
    VdcFactoryService,
    {
      provide: BASE_VDC_INVOICE_SERVICE,
      useClass: VdcInvoiceService,
    },
  ],
  controllers: [VdcController, VdcAdminController],
  exports: [
    EdgeService,
    OrgService,
    VdcService,
    NetworkService,
    VdcFactoryService,
    BASE_VDC_INVOICE_SERVICE,
  ],
})
export class VdcModule {}
