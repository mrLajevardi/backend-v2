import { Test, TestingModule } from '@nestjs/testing';
import { QualityPlansService } from './quality-plans.service';

describe('QualityPlansService', () => {
  let service: QualityPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualityPlansService],
    }).compile();

    service = module.get<QualityPlansService>(QualityPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
