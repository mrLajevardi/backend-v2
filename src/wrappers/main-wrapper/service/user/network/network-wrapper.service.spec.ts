import { NetworkWrapperService } from './network-wrapper.service';
import { TestBed } from '@automock/jest';

describe('NetworkWrapperService', () => {
  let service: NetworkWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(NetworkWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
