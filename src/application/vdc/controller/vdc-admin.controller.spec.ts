import { Test, TestingModule } from '@nestjs/testing';
import { VdcAdminController } from './vdc-admin.controller';
import { OrganizationService } from 'src/application/base/organization/organization.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { UserService } from 'src/application/base/user/service/user.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { EdgeService } from '../service/edge.service';
import { VdcService } from '../service/vdc.service';
import { TasksService } from 'src/application/base/tasks/service/tasks.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { BullModule } from '@nestjs/bull';
import { OrgService } from '../service/org.service';
import { NetworkService } from '../service/network.service';
import { ConfigsTableService } from 'src/application/base/crud/configs-table/configs-table.service';
import { ServiceItemsTableService } from 'src/application/base/crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { OrganizationTableService } from 'src/application/base/crud/organization-table/organization-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { DiscountsTableService } from 'src/application/base/crud/discounts-table/discounts-table.service';
import { InvoicesTableService } from 'src/application/base/crud/invoices-table/invoices-table.service';
import { PlansQueryService } from 'src/application/base/crud/plans-table/plans-query.service';
import { SessionsTableService } from 'src/application/base/crud/sessions-table/sessions-table.service';
import { ServiceService } from 'src/application/base/service/services/service.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';
import { TasksTableService } from 'src/application/base/crud/tasks-table/tasks-table.service';

describe('VdcAdminController', () => {
  let controller: VdcAdminController;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [
        DatabaseModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
      ],
      providers: [],
      controllers: [VdcAdminController],
    }).compile();

    controller = module.get<VdcAdminController>(VdcAdminController);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
