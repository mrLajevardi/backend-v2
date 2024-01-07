import { ServicePropertiesTableService } from './service-properties-table.service';
import { TestBed } from '@automock/jest';

describe('ServicePropertiesTableService', () => {
  let service: ServicePropertiesTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServicePropertiesTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
