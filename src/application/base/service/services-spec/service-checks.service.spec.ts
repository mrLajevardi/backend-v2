import { ServiceChecksService } from '../services/service-checks.service';
import { TestBed } from '@automock/jest';

describe('ServiceChecksService', () => {
  let service: ServiceChecksService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceChecksService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
