import { ServiceItemsSumService } from './service-items-sum.service';
import { TestBed } from '@automock/jest';

describe('ServiceItemsSumService', () => {
  let service: ServiceItemsSumService;
  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceItemsSumService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
