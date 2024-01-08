import { IpSetsWrapperService } from './ip-sets-wrapper.service';
import { TestBed } from '@automock/jest';

describe('IpSetsWrapperService', () => {
  let service: IpSetsWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(IpSetsWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
