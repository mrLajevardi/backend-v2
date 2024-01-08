import { ServicePaymentsTableService } from './service-payments-table.service';
import { TestBed } from '@automock/jest';

describe('ServicePaymentsTableService', () => {
  let service: ServicePaymentsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServicePaymentsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
