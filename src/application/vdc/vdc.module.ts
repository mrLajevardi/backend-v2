import { Module } from '@nestjs/common';
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
import { ServiceModule } from '../base/service/service.module';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    //TasksModule,
    SessionsModule,
    OrganizationModule,
    UserModule,
    ServiceModule,
    
  ],
  providers: [VdcService, OrgService, EdgeService],
  controllers: [VdcController, VdcAdminController],
})
export class VdcModule {}
