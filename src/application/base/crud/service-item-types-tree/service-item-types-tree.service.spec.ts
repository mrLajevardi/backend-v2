import { ServiceItemTypesTreeService } from './service-item-types-tree.service';
import { TestBed } from '@automock/jest';

describe('ServiceItemTypesTreeService', () => {
  let service: ServiceItemTypesTreeService;
  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceItemTypesTreeService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
