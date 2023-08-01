import { Test, TestingModule } from '@nestjs/testing';
import { TaskManagerService } from './task-manager.service';
import { SessionsService } from '../../sessions/sessions.service';
import { OrganizationService } from '../../organization/organization.service';
import { UserService } from '../../user/service/user.service';
import { EdgeService } from 'src/application/vdc/service/edge.service';
import { OrgService } from 'src/application/vdc/service/org.service';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { VdcService } from 'src/application/vdc/service/vdc.service';
import { BullModule } from '@nestjs/bull';
import { TasksService } from './tasks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TransactionsService } from '../../transactions/transactions.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { SessionsTableService } from '../../crud/sessions-table/sessions-table.service';

describe('TaskManagerService', () => {
  let service: TaskManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
      ],
      providers: [],
    }).compile();

    service = module.get<TaskManagerService>(TaskManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
