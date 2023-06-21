import { Module } from '@nestjs/common';
import { VdcService } from './service/vdc.service';
import { OrgService } from './service/org.service';
import { EdgeService } from './service/edge.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TasksModule } from '../base/tasks/tasks.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { ServiceInstancesModule } from '../base/service/service-instances/service-instances.module';
import { ServicePropertiesModule } from '../base/service/service-properties/service-properties.module';
import { ServiceItemsModule } from '../base/service/service-items/service-items.module';
import { ConfigsModule } from '../base/service/configs/configs.module';
import { OrganizationModule } from '../base/organization/organization.module';
import { UserModule } from '../base/user/user/user.module';
import { VdcController } from './controller/vdc.controller';
import { VdcAdminController } from './controller/vdc-admin.controller';

@Module({
  imports: [
    DatabaseModule,
    //TasksModule,
    SessionsModule,
    ServiceInstancesModule,
    ServicePropertiesModule,
    ServiceItemsModule,
    ConfigsModule,
    OrganizationModule,
    UserModule,
  ],
  providers: [VdcService, OrgService, EdgeService],
  controllers: [VdcController, VdcAdminController],
})
export class VdcModule {}
