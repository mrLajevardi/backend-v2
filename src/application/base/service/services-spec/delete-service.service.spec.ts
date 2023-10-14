import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DeleteServiceService } from '../services/delete-service.service';
import { CrudModule } from '../../crud/crud.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TaskManagerService } from '../../tasks/service/task-manager.service';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserModule } from '../../user/user.module';
import { BullModule } from '@nestjs/bull';
import { PayAsYouGoService } from '../../pay-as-you-go/pay-as-you-go.service';
import { TasksService } from '../../tasks/service/tasks.service';
import { CreateServiceService } from '../services/create-service.service';
import { DiscountsService } from '../services/discounts.service';
import { ExtendServiceService } from '../services/extend-service.service';
import { ServiceChecksService } from '../services/service-checks.service';
import { ServiceService } from '../services/service.service';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { OrganizationModule } from '../../organization/organization.module';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { PaymentModule } from 'src/application/payment/payment.module';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { VgpuDnatService } from 'src/application/vgpu/vgpu-dnat.service';
import { ServiceServiceFactory } from '../Factory/service.service.factory';
import { DatacenterModule } from '../../datacenter/datacenter.module';
import { InvoicesModule } from '../../invoice/invoices.module';

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
        PaymentModule,
        BullModule.registerQueue({
          name: 'tasks2',
        }),
        LoggerModule,
        // VdcModule,
        forwardRef(() => VgpuModule),
        CrudModule,
        SessionsModule,
        OrganizationModule,
        TransactionsModule,
        InvoicesModule,
        VdcModule,
        ServicePropertiesModule,
        DatacenterModule,
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
        VgpuDnatService,
        ServiceServiceFactory,
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
