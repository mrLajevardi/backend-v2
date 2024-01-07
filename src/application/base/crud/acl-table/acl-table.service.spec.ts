import { ACLTableService } from './acl-table.service';
import { TestBed } from '@automock/jest';

describe('ACLTableService', () => {
  let service: ACLTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ACLTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(process.env.NODE_ENV).toBe('test');

    expect(service).toBeDefined();
  });
});
