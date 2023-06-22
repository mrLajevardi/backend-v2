import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { EdgeService } from 'src/application/vdc/service/edge.service';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { OrgService } from 'src/application/vdc/service/org.service';
import { VdcService } from 'src/application/vdc/service/vdc.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { SessionsTableService } from '../../crud/sessions-table/sessions-table.service';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { OrganizationService } from '../../organization/organization.service';
import { SessionsService } from '../../sessions/sessions.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { UserService } from '../../user/user.service';
import { TaskManagerService } from './task-manager.service';
import { BullModule } from '@nestjs/bull';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
      ],
      providers: [
        TasksService,
        TransactionsService,
        TasksService,
        TaskManagerService,
        SessionsService,
        ServiceInstancesTableService,
        ServicePropertiesTableService,
        ServiceItemsTableService,
        ConfigsTableService,
        OrganizationService,
        UserService,
        EdgeService,
        OrgService,
        NetworkService,
        VdcService,
        TransactionsTableService,
        TasksTableService,
        OrganizationTableService,
        UserTableService,
        SessionsTableService,
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
