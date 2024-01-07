import { ServiceInstancesTableService } from './service-instances-table.service';
import { TestBed } from '@automock/jest';

describe('ServiceInstancesTableService', () => {
  let service: ServiceInstancesTableService;
  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceInstancesTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
