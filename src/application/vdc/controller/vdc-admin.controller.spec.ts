import { Test, TestingModule } from '@nestjs/testing';
import { VdcAdminController } from './vdc-admin.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { EdgeService } from '../service/edge.service';
import { VdcService } from '../service/vdc.service';
import { OrgService } from '../service/org.service';
import { NetworkService } from '../service/network.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { OrganizationModule } from 'src/application/base/organization/organization.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { UserModule } from 'src/application/base/user/user.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { AbilityModule } from 'src/application/base/security/ability/ability.module';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { BullModule } from '@nestjs/bull';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { ServiceModule } from 'src/application/base/service/service.module';
import { VdcModule } from '../vdc.module';
import { VgpuDnatService } from 'src/application/vgpu/vgpu-dnat.service';
import { TasksModule } from 'src/application/base/tasks/tasks.module';
import { VdcWrapperService } from 'src/wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('VdcAdminController', () => {
  let controller: VdcAdminController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AbilityModule,
        CrudModule,
        LoggerModule,
        VcloudWrapperModule,
        TasksModule,
        SessionsModule,
        OrganizationModule,
        UserModule,
        ServicePropertiesModule,
        BullModule.registerQueue({
          name: 'tasks2',
        }),
        // VdcModule,
        forwardRef(() => VgpuModule),
        ServiceModule,
        VdcModule,
        MainWrapperModule,
      ],
      providers: [
        VdcService,
        OrgService,
        EdgeService,
        NetworkService,
        TaskManagerService,
        VgpuDnatService,
        VdcWrapperService,
      ],

      controllers: [VdcAdminController],
    }).compile();

    controller = module.get<VdcAdminController>(VdcAdminController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
