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

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    LoggerModule,
    forwardRef(()=>TasksModule),
    SessionsModule,
    OrganizationModule,
    UserModule,
    ServicePropertiesModule,
    AbilityModule,
  ],
  providers: [VdcService, OrgService, EdgeService, NetworkService],
  controllers: [VdcController, VdcAdminController],
  exports: [EdgeService, OrgService, VdcService, NetworkService],
})
export class VdcModule {}
