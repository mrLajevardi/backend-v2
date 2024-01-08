import { AdminVdcWrapperService } from './admin-vdc-wrapper.service';
import { TestBed } from '@automock/jest';

describe('AdminVdcWrapperService', () => {
  let service: AdminVdcWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(AdminVdcWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
