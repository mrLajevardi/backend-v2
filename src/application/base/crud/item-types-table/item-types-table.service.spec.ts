import { ItemTypesTableService } from './item-types-table.service';
import { TestBed } from '@automock/jest';

describe('ItemTypesTableService', () => {
  let service: ItemTypesTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ItemTypesTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
