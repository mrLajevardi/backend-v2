import { CheckServiceService } from './check-service.service';
import { TestBed } from '@automock/jest';

describe('CheckServiceService', () => {
  let service: CheckServiceService;

  beforeAll(async () => {
    const { unit } = TestBed.create(CheckServiceService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
