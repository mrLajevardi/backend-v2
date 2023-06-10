import { Test, TestingModule } from '@nestjs/testing';
import { ItemTypesController } from './item-types.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ItemTypesService } from './item-types.service';

describe('ItemTypesController', () => {
  let controller: ItemTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ItemTypesService],
      controllers: [ItemTypesController],
    }).compile();

    controller = module.get<ItemTypesController>(ItemTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
