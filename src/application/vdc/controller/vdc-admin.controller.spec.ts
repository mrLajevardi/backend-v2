import { Test, TestingModule } from '@nestjs/testing';
import { VdcAdminController } from './vdc-admin.controller';
import { OrganizationService } from 'src/application/base/organization/organization.service';
import { ConfigsService } from 'src/application/base/service/configs/configs.service';
import { ServiceInstancesService } from 'src/application/base/service/service-instances/service/service-instances.service';
import { ServiceItemsService } from 'src/application/base/service/service-items/service-items.service';
import { ServicePropertiesService } from 'src/application/base/service/service-properties/service-properties.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { UserService } from 'src/application/base/user/user/user.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { EdgeService } from '../service/edge.service';
import { VdcService } from '../service/vdc.service';
import { TasksService } from 'src/application/base/tasks/service/tasks.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { BullModule } from '@nestjs/bull';
import { OrgService } from '../service/org.service';
import { NetworkService } from '../service/network.service';

describe('VdcAdminController', () => {
  let controller: VdcAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
      ],
      providers: [
        VdcService,
        OrganizationService,
        ServiceInstancesService,
        ServicePropertiesService,
        ServiceItemsService,
        ConfigsService,
        OrganizationService,
        UserService,
        SessionsService,
        TransactionsService,
        TasksService,
        EdgeService,
        TaskManagerService,
        OrgService,
        NetworkService,
        
      ],
      controllers: [VdcAdminController],
    }).compile();

    controller = module.get<VdcAdminController>(VdcAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
