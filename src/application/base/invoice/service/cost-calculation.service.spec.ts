import { CostCalculationService } from './cost-calculation.service';
import { TestBed } from '@automock/jest';

describe('CostCalculationService', () => {
  let service: CostCalculationService;

  beforeAll(async () => {
    const { unit } = TestBed.create(CostCalculationService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
