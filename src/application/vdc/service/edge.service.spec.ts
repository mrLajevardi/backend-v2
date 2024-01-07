import { EdgeService } from './edge.service';
import { TestBed } from '@automock/jest';

describe('EdgeService', () => {
  let service: EdgeService;

  beforeAll(async () => {
    const { unit } = TestBed.create(EdgeService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
