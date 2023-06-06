import { Test, TestingModule } from '@nestjs/testing';
import { ItemTypesService } from './item-types.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ItemTypesService', () => {
  let service: ItemTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ItemTypesService],
    }).compile();

    service = module.get<ItemTypesService>(ItemTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
