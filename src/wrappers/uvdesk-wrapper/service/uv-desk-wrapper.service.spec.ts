import { UvDeskWrapperService } from './uv-desk-wrapper.service';
import { TestBed } from '@automock/jest';

describe('UvDeskWrapperService', () => {
  let service: UvDeskWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(UvDeskWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
