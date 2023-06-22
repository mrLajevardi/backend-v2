import { Test, TestingModule } from '@nestjs/testing';
import { TaskManagerService } from './task-manager.service';
import { SessionsService } from '../../sessions/sessions.service';
import { ServiceInstancesService } from '../../service/service-instances/service/service-instances.service';
import { ServicePropertiesService } from '../../service/service-properties/service-properties.service';
import { ServiceItemsService } from '../../service/service-items/service-items.service';
import { ConfigsService } from '../../service/configs/configs.service';
import { OrganizationService } from '../../organization/organization.service';
import { UserService } from '../../user/user/user.service';
import { EdgeService } from 'src/application/vdc/service/edge.service';
import { OrgService } from 'src/application/vdc/service/org.service';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { VdcService } from 'src/application/vdc/service/vdc.service';
import { BullModule } from '@nestjs/bull';
import { TasksService } from './tasks.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TransactionsService } from '../../transactions/transactions.service';

describe('TaskManagerService', () => {
  let service: TaskManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
      ],
      providers: [
        TransactionsService,
        TasksService,
        TaskManagerService,
        SessionsService,
        ServiceInstancesService,
        ServicePropertiesService,
        ServiceItemsService,
        ConfigsService,
        OrganizationService,
        UserService,
        EdgeService,
        OrgService,
        NetworkService,
        VdcService,
      ],
    }).compile();

    service = module.get<TaskManagerService>(TaskManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
