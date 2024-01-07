import { SecurityToolsService } from './security-tools.service';
import { TestBed } from '@automock/jest';

describe('SecurityToolsService', () => {
  let service: SecurityToolsService;

  beforeAll(async () => {
    const { unit } = TestBed.create(SecurityToolsService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
