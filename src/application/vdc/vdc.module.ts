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
import { BASE_VDC_INVOICE_SERVICE } from './interface/service/base-vdc-invoice-service.interface';
import { VdcInvoiceService } from './service/vdc-invoice.service';
import { ServiceModule } from '../base/service/service.module';
import { BASE_VDC_DETAIL_SERVICE } from './interface/service/base-vdc-detail-service.interface';
import { VdcDetailService } from './service/vdc-detail.service';
import { ServiceInstancesTableModule } from '../base/crud/service-instances-table/service-instances-table.module';
import { ServiceItemModule } from '../base/service-item/service-item.module';
import { VdcDetailFactoryService } from './service/vdc-detail.factory.service';
import { VdcDetailFecadeService } from './service/vdc-detail.fecade.service';
import { NetworksModule } from '../networks/networks.module';
import { EdgeGatewayModule } from '../edge-gateway/edge-gateway.module';
import { NatModule } from '../nat/nat.module';
import { VmModule } from '../vm/vm.module';

@Module({
  imports: [
    MainWrapperModule,
    DatabaseModule,
    CrudModule,
    LoggerModule,
    EdgeGatewayModule,
    NatModule,
    VmModule,
    forwardRef(() => ServiceModule),

    // TasksModule,
    forwardRef(() => TasksModule),
    SessionsModule,
    forwardRef(() => InvoicesModule),
    OrganizationModule,
    UserModule,
    ServicePropertiesModule,
    AbilityModule,
    // forwardRef(() => ServiceModule),
    NetworksModule,
    ServiceItemModule,
    ServiceInstancesTableModule,
  ],
  providers: [
    VdcService,
    OrgService,
    EdgeService,
    NetworkService,
    VdcFactoryService,
    VdcDetailFactoryService,
    {
      provide: BASE_VDC_INVOICE_SERVICE,
      useClass: VdcInvoiceService,
    },
    {
      provide: BASE_VDC_DETAIL_SERVICE,
      useClass: VdcDetailService,
    },
    VdcDetailFecadeService,
  ],
  controllers: [VdcController, VdcAdminController],
  exports: [
    EdgeService,
    OrgService,
    VdcService,
    NetworkService,
    VdcFactoryService,
    BASE_VDC_INVOICE_SERVICE,
    BASE_VDC_DETAIL_SERVICE,
  ],
})
export class VdcModule {}
