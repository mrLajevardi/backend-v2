import { Test, TestingModule } from '@nestjs/testing';
import { VgpuService } from './vgpu.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { SessionsService } from '../base/sessions/sessions.service';
import { UserService } from '../base/user/user.service';
import { OrganizationService } from '../base/organization/organization.service';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { UserTableService } from '../base/crud/user-table/user-table.service';
import { SessionsTableService } from '../base/crud/sessions-table/sessions-table.service';
import { OrganizationTableService } from '../base/crud/organization-table/organization-table.service';
import { JwtService } from '@nestjs/jwt';
import { PayAsYouGoService } from '../base/service/services/pay-as-you-go.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { ItemTypesTableService } from '../base/crud/item-types-table/item-types-table.service';
import { InvoiceItemsTableService } from '../base/crud/invoice-items-table/invoice-items-table.service';
import { InvoicePropertiesTableService } from '../base/crud/invoice-properties-table/invoice-properties-table.service';
import { TaskManagerService } from '../base/tasks/service/task-manager.service';
import { TasksTableService } from '../base/crud/tasks-table/tasks-table.service';
import { TransactionsTableService } from '../base/crud/transactions-table/transactions-table.service';
import { ServiceInstancesTableService } from '../base/crud/service-instances-table/service-instances-table.service';
import { BullModule } from '@nestjs/bull';
import { TasksService } from '../base/tasks/service/tasks.service';
import { ServiceItemsTableService } from '../base/crud/service-items-table/service-items-table.service';
import { EdgeService } from '../vdc/service/edge.service';
import { OrgService } from '../vdc/service/org.service';
import { ServiceService } from '../base/service/services/service.service';
import { NetworkService } from '../vdc/service/network.service';
import { VdcService } from '../vdc/service/vdc.service';

describe('VgpuService', () => {
  let service: VgpuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
      ],
      providers: [

        
      ],
    }).compile();

    service = module.get<VgpuService>(VgpuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
