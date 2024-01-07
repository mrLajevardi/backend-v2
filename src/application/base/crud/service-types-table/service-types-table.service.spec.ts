import { ServiceTypesTableService } from './service-types-table.service';
import { TestBed } from '@automock/jest';

describe('ServiceTypesTableService', () => {
  let service: ServiceTypesTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceTypesTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
