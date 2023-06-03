import { Test, TestingModule } from '@nestjs/testing';
import { ServiceItemsController } from './service-items.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ServiceItemsService } from './service-items.service';

describe('ServiceItemsController', () => {
  let controller: ServiceItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceItemsService],
      controllers: [ServiceItemsController],
    }).compile();

    controller = module.get<ServiceItemsController>(ServiceItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
