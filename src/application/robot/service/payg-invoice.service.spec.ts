import { Test, TestingModule } from '@nestjs/testing';
import { PaygInvoiceService } from './payg-invoice.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { NotificationModule } from 'src/application/base/notification/notification.module';
import { PayAsYouGoModule } from 'src/application/base/pay-as-you-go/pay-as-you-go.module';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { TasksModule } from 'src/application/base/tasks/tasks.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';

describe('PaygInvoiceService', () => {
  let service: PaygInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        NotificationModule,
        TasksModule,
        ServicePropertiesModule,
        SessionsModule,
        LoggerModule,
        PayAsYouGoModule,
      ],
      providers: [PaygInvoiceService],
    }).compile();

    service = module.get<PaygInvoiceService>(PaygInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
