import { Test, TestingModule } from '@nestjs/testing';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ServiceReportsViewService } from './service-reports-view.service';

describe('ServiceReportsViewService', () => {
  let service: ServiceReportsViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceReportsViewService],
    }).compile();

    service = module.get<ServiceReportsViewService>(ServiceReportsViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
