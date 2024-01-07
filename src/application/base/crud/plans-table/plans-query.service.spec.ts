import { PlansQueryService } from './plans-query.service';
import { TestBed } from '@automock/jest';

describe('PlansQueryService', () => {
  let service: PlansQueryService;
  beforeAll(async () => {
    const { unit } = TestBed.create(PlansQueryService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
