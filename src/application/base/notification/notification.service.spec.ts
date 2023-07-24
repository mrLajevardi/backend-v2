import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
