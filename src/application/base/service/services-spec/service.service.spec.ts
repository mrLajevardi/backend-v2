import { ServiceService } from '../services/service.service';
import { TestBed } from '@automock/jest';

describe('ServiceService', () => {
  let service: ServiceService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
