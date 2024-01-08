import { DiscountsTableService } from './discounts-table.service';
import { TestBed } from '@automock/jest';

describe('DiscountsTableService', () => {
  let service: DiscountsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(DiscountsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
