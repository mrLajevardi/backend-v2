import { Test, TestingModule } from '@nestjs/testing';
import { ServiceReportsViewService } from './service-reports-view.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('ServiceReportsViewService', () => {
  let service: ServiceReportsViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ServiceReportsViewService],
    }).compile();

    service = module.get<ServiceReportsViewService>(ServiceReportsViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
