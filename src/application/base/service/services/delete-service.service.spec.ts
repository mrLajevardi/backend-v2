import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DeleteServiceService } from './delete-service.service';
import { CrudModule } from '../../crud/crud.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TasksModule } from '../../tasks/tasks.module';
import { TaskManagerService } from '../../tasks/service/task-manager.service';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { InvoicesModule } from '../../invoice/invoices.module';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserModule } from '../../user/user.module';
import { BullModule } from '@nestjs/bull';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PayAsYouGoService } from './pay-as-you-go.service';
import { TasksService } from '../../tasks/service/tasks.service';
import { EdgeService } from 'src/application/vdc/service/edge.service';
import { OrgService } from 'src/application/vdc/service/org.service';
import { NetworksModule } from 'src/application/networks/networks.module';
import { CreateServiceService } from './create-service.service';
import { DiscountsService } from './discounts.service';
import { ExtendServiceService } from './extend-service.service';
import { ServiceChecksService } from './service-checks/service-checks.service';
import { ServiceService } from './service.service';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { OrganizationModule } from '../../organization/organization.module';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { NetworksService } from 'src/application/networks/networks.service';
import { NetworkService } from 'src/application/vdc/service/network.service';

describe('DeleteServiceService', () => {
  let service: DeleteServiceService;

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
        NetworkService
      ],
    }).compile();

    service = module.get<DeleteServiceService>(DeleteServiceService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
