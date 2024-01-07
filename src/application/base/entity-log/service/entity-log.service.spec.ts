import { EntityLogService } from './entity-log.service';
import { TestBed } from '@automock/jest';

describe('EntityLogService', () => {
  let service: EntityLogService;

  beforeAll(async () => {
    const { unit } = TestBed.create(EntityLogService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
