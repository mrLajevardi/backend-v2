import { VmDeleteWrapperService } from './vm-delete-wrapper.service';
import { TestBed } from '@automock/jest';

describe('VmDeleteWrapperService', () => {
  let service: VmDeleteWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VmDeleteWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
