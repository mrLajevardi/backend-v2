import { TestBed } from '@automock/jest';
import { ServiceItemsTableService } from './service-items-table.service';

describe('ServiceItemsTableService', () => {
  let service: ServiceItemsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceItemsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
