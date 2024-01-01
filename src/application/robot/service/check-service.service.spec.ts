import { Test, TestingModule } from '@nestjs/testing';
import { CheckServiceService } from './check-service.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { NotificationModule } from 'src/application/base/notification/notification.module';
import { PayAsYouGoModule } from 'src/application/base/pay-as-you-go/pay-as-you-go.module';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { TasksModule } from 'src/application/base/tasks/tasks.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';

describe('CheckServiceService', () => {
  let service: CheckServiceService;

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
      providers: [CheckServiceService],
    }).compile();

    service = module.get<CheckServiceService>(CheckServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
