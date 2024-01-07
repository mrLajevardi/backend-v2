import { VmUpdateWrapperService } from './vm-update-wrapper.service';
import { TestBed } from '@automock/jest';

describe('VmUpdateWrapperService', () => {
  let service: VmUpdateWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VmUpdateWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
