import { VcloudWrapperService } from './vcloud-wrapper.service';
import { TestBed } from '@automock/jest';
describe('VcloudWrapperService', () => {
  let service: VcloudWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VcloudWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
