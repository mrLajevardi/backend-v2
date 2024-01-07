import { ServiceReportsViewService } from './service-reports-view.service';
import { TestBed } from '@automock/jest';

describe('ServiceReportsViewService', () => {
  let service: ServiceReportsViewService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceReportsViewService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
