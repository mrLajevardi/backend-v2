import { PlansTableService } from './plans-table.service';
import { TestBed } from '@automock/jest';

describe('PlansTableService', () => {
  let service: PlansTableService;
  beforeAll(async () => {
    const { unit } = TestBed.create(PlansTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
