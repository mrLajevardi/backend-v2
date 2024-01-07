import { VmGetWrapperService } from './vm-get-wrapper.service';
import { TestBed } from '@automock/jest';

describe('VmGetWrapperService', () => {
  let service: VmGetWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VmGetWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
