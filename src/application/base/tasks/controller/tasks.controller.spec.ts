import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';
import { TasksService } from '../service/tasks.service';
import { BullModule } from '@nestjs/bull';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { OrganizationModule } from '../../organization/organization.module';
import { ServiceModule } from '../../service/service.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { AbilityModule } from '../../security/ability/ability.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { EdgeGatewayModule } from 'src/application/edge-gateway/edge-gateway.module';
import { NatModule } from 'src/application/nat/nat.module';
import { NetworksModule } from 'src/application/networks/networks.module';
import { TaskManagerModule } from '../../task-manager/task-manager.module';
import { TaskFactoryService } from '../service/task.factory.service';
import { VmModule } from '../../../vm/vm.module';

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        VmModule,
        AbilityModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
        LoggerModule,
        ServicePropertiesModule,
        // VdcModule,
        forwardRef(() => VgpuModule),
        CrudModule,
        SessionsModule,
        OrganizationModule,
        MainWrapperModule,
        EdgeGatewayModule,
        NatModule,
        NetworksModule,
        TaskManagerModule,
        forwardRef(() => ServiceModule),
      ],
      providers: [TasksService, TaskFactoryService],
      controllers: [TasksController],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
