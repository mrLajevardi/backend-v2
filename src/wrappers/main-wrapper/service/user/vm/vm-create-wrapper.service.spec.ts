import { VmCreateWrapperService } from './vm-create-wrapper.service';
import { TestBed } from '@automock/jest';

describe('VmCreateWrapperService', () => {
  let service: VmCreateWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VmCreateWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
