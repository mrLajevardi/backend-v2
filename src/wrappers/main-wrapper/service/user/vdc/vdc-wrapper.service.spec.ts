import { VdcWrapperService } from './vdc-wrapper.service';
import { TestBed } from '@automock/jest';

describe('VdcWrapperService', () => {
  let service: VdcWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VdcWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
