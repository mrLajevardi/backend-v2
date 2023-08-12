import { Test, TestingModule } from '@nestjs/testing';
import { ExtendServiceService } from '../services/extend-service.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { BullModule } from '@nestjs/bull';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../../crud/crud.module';
import { OrganizationModule } from '../../organization/organization.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserModule } from '../../user/user.module';
import { TasksModule } from '../../tasks/tasks.module';
import { PaymentModule } from 'src/application/payment/payment.module';

describe('ExtendServiceService', () => {
  let service: ExtendServiceService;

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
          name: 'tasks',
        }),
        LoggerModule,
        // VdcModule,
        OrganizationModule,
        TransactionsModule,
        TasksModule,
      ],
      providers: [ExtendServiceService],
    }).compile();

    service = module.get<ExtendServiceService>(ExtendServiceService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
