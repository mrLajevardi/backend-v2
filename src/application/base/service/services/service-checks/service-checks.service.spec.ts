import { Test, TestingModule } from '@nestjs/testing';
import { ServiceChecksService } from './service-checks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DiscountsService } from '../discounts.service';
import { TransactionsService } from '../../../transactions/transactions.service';
import { UserService } from '../../../user/service/user.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServiceTypesTableService } from 'src/application/base/crud/service-types-table/service-types-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { DiscountsTableService } from 'src/application/base/crud/discounts-table/discounts-table.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';
import { BullModule } from '@nestjs/bull';
import { forwardRef } from '@nestjs/common';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { OrganizationModule } from 'src/application/base/organization/organization.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { TasksService } from 'src/application/base/tasks/service/tasks.service';
import { TransactionsModule } from 'src/application/base/transactions/transactions.module';
import { UserModule } from 'src/application/base/user/user.module';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CreateServiceService } from '../create-service.service';
import { DeleteServiceService } from '../delete-service.service';
import { ExtendServiceService } from '../extend-service.service';
import { PayAsYouGoService } from '../pay-as-you-go.service';
import { ServiceService } from '../service.service';

describe('ServiceChecksService', () => {
  let service: ServiceChecksService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CrudModule,
        DatabaseModule,
        SessionsModule,
        UserModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
        LoggerModule,
        // VdcModule,
        forwardRef(() => VgpuModule),
        CrudModule,
        SessionsModule,
        OrganizationModule,
        TransactionsModule,
        VdcModule,
      ],
      providers: [
        ServiceService,
        PayAsYouGoService,
        CreateServiceService,
        ExtendServiceService,
        DiscountsService,
        ServiceChecksService,
        DeleteServiceService,
        TaskManagerService,
        TasksService,
        NetworkService,
      ],
    }).compile();

    service = module.get<ServiceChecksService>(ServiceChecksService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
