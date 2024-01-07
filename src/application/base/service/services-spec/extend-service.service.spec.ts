import { ExtendServiceService } from '../services/extend-service.service';
import { TestBed } from '@automock/jest';

describe('ExtendServiceService', () => {
  let service: ExtendServiceService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ExtendServiceService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
