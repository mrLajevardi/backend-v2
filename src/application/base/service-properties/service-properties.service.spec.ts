import { ServicePropertiesService } from './service-properties.service';
import { TestBed } from '@automock/jest';

describe('ServicePropertiesService', () => {
  let service: ServicePropertiesService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServicePropertiesService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
