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

@Module({
  imports: [
    MainWrapperModule,
    DatabaseModule,
    CrudModule,
    LoggerModule,
    forwardRef(() => TasksModule),
    SessionsModule,
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
  ],
  controllers: [VdcController, VdcAdminController],
  exports: [
    EdgeService,
    OrgService,
    VdcService,
    NetworkService,
    VdcFactoryService,
  ],
})
export class VdcModule {}
