import { Test, TestingModule } from '@nestjs/testing';
import { ItemTypesTableService } from './item-types-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ItemTypesTableService', () => {
  let service: ItemTypesTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ItemTypesTableService, TestDataService],
    }).compile();

    service = module.get<ItemTypesTableService>(ItemTypesTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
