import { DiscountsService } from '../services/discounts.service';
import { TestBed } from '@automock/jest';

describe('DiscountsService', () => {
  let service: DiscountsService;

  beforeAll(async () => {
    const { unit } = TestBed.create(DiscountsService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
