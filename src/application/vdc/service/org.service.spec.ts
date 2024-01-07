import { OrgService } from './org.service';
import { TestBed } from '@automock/jest';

describe('OrgService', () => {
  let service: OrgService;

  beforeAll(async () => {
    const { unit } = TestBed.create(OrgService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
