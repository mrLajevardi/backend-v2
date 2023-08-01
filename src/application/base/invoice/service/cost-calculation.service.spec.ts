import { Test, TestingModule } from '@nestjs/testing';
import { CostCalculationService } from './cost-calculation.service';

describe('CostCalculationService', () => {
  let service: CostCalculationService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [CostCalculationService],
    }).compile();

    service = module.get<CostCalculationService>(CostCalculationService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
