import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('NotificationService', () => {
  let service: NotificationService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
