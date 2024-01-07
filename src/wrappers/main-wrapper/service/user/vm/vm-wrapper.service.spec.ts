import { VmWrapperService } from './vm-wrapper.service';
import { TestBed } from '@automock/jest';

describe('VmWrapperService', () => {
  let service: VmWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VmWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
