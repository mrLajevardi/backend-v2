import { NatService } from './nat.service';
import { TestBed } from '@automock/jest';

describe('NatService', () => {
  let service: NatService;

  beforeAll(async () => {
    const { unit } = TestBed.create(NatService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
