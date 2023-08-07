import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from '../services/service.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { BullModule } from '@nestjs/bull';
import { forwardRef } from '@nestjs/common';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../../crud/crud.module';
import { OrganizationModule } from '../../organization/organization.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TaskManagerService } from '../../tasks/service/task-manager.service';
import { TasksService } from '../../tasks/service/tasks.service';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserModule } from '../../user/user.module';
import { CreateServiceService } from '../services/create-service.service';
import { DeleteServiceService } from '../services/delete-service.service';
import { DiscountsService } from '../services/discounts.service';
import { ExtendServiceService } from '../services/extend-service.service';
import { PayAsYouGoService } from '../../pay-as-you-go/pay-as-you-go.service';
import { ServiceChecksService } from '../services/service-checks.service';
import { PaymentModule } from 'src/application/payment/payment.module';
import { PaymentService } from 'src/application/payment/payment.service';
import { TasksModule } from '../../tasks/tasks.module';
import { InvoicesModule } from '../../invoice/invoices.module';

describe('ServiceService', () => {
  let service: ServiceService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        // CrudModule,
        // DatabaseModule,
        // SessionsModule,
        // LoggerModule,
        // UserModule,
        // PaymentModule,
        // forwardRef(() => InvoicesModule),
        // forwardRef(() => VgpuModule),
        // forwardRef(() => TasksModule),
        // TransactionsModule,
      ],
      providers: [
        // PayAsYouGoService,
        // CreateServiceService,
        // ExtendServiceService,
        // DiscountsService,
        // ServiceChecksService,
        // DeleteServiceService,
      ],
    }).compile();

    //service = module.get<ServiceService>(ServiceService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    //expect(service).toBeDefined();
  });
});
