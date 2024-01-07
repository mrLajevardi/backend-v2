import { NetworkService } from './network.service';
import { TestBed } from '@automock/jest';

describe('NetworkService', () => {
  let service: NetworkService;

  beforeAll(async () => {
    const { unit } = TestBed.create(NetworkService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
