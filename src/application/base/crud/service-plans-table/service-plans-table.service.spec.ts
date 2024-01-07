import { ServicePlansTableService } from './service-plans-table.service';
import { TestBed } from '@automock/jest';

describe('ServicePlansTableService', () => {
  let service: ServicePlansTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServicePlansTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
