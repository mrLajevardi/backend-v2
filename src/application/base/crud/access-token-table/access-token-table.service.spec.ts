import { AccessTokenTableService } from './access-token-table.service';
import { TestBed } from '@automock/jest';

describe('AccessTokenTableService', () => {
  let service: AccessTokenTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(AccessTokenTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
