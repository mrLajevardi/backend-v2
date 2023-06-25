import { Test, TestingModule } from '@nestjs/testing';
import { VgpuController } from './vgpu.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { OrganizationTableService } from '../base/crud/organization-table/organization-table.service';
import { SessionsTableService } from '../base/crud/sessions-table/sessions-table.service';
import { UserTableService } from '../base/crud/user-table/user-table.service';
import { OrganizationService } from '../base/organization/organization.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { UserService } from '../base/user/user.service';
import { VgpuService } from './vgpu.service';
import { InvoiceItemsTableService } from '../base/crud/invoice-items-table/invoice-items-table.service';
import { InvoicePropertiesTableService } from '../base/crud/invoice-properties-table/invoice-properties-table.service';
import { ItemTypesTableService } from '../base/crud/item-types-table/item-types-table.service';
import { ServiceInstancesTableService } from '../base/crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from '../base/crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { TasksTableService } from '../base/crud/tasks-table/tasks-table.service';
import { TransactionsTableService } from '../base/crud/transactions-table/transactions-table.service';
import { PayAsYouGoService } from '../base/service/services/pay-as-you-go.service';
import { TaskManagerService } from '../base/tasks/service/task-manager.service';
import { TasksService } from '../base/tasks/service/tasks.service';
import { EdgeService } from '../vdc/service/edge.service';
import { NetworkService } from '../vdc/service/network.service';
import { OrgService } from '../vdc/service/org.service';
import { VdcService } from '../vdc/service/vdc.service';
import { JwtService } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { ServiceTypesTableService } from '../base/crud/service-types-table/service-types-table.service';

describe('VgpuController', () => {
  let controller: VgpuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [
        VgpuController,

      ],
      providers: [
      ]
    }).compile();

    controller = module.get<VgpuController>(VgpuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
