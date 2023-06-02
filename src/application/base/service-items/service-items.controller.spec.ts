import { Test, TestingModule } from '@nestjs/testing';
import { ServiceItemsController } from './service-items.controller';

describe('ServiceItemsController', () => {
  let controller: ServiceItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceItemsController],
    }).compile();

    controller = module.get<ServiceItemsController>(ServiceItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
