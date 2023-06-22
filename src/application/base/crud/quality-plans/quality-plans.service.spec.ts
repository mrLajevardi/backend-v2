import { Test, TestingModule } from '@nestjs/testing';
import { QualityPlansService } from './quality-plans.service';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('QualityPlansService', () => {
  let service: QualityPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [QualityPlansService],
    }).compile();

    service = module.get<QualityPlansService>(QualityPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
