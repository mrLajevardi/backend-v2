import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceService } from '../services/create-service.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ExtendServiceService } from '../services/extend-service.service';
import { ServiceChecksService } from '../services/service-checks.service';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { CrudModule } from '../../crud/crud.module';
import { InvoicesModule } from '../../invoice/invoices.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TasksModule } from '../../tasks/tasks.module';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserModule } from '../../user/user.module';
import { PaymentModule } from 'src/application/payment/payment.module';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { VgpuDnatService } from 'src/application/vgpu/vgpu-dnat.service';
import { DatacenterModule } from '../../datacenter/datacenter.module';

describe('CreateServiceService', () => {
  let service: CreateServiceService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CrudModule,
        DatabaseModule,
        DatacenterModule,
        SessionsModule,
        PaymentModule,
        UserModule,
        InvoicesModule,
        TasksModule,
        forwardRef(() => VgpuModule),
        TransactionsModule,
        ServicePropertiesModule,
      ],
      providers: [
        CreateServiceService,
        ExtendServiceService,
        ServiceChecksService,
        VgpuDnatService,
      ],
    }).compile();

    service = module.get<CreateServiceService>(CreateServiceService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
