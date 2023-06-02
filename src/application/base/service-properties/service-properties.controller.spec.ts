import { Test, TestingModule } from '@nestjs/testing';
import { ServicePropertiesController } from './service-properties.controller';

describe('ServicePropertiesController', () => {
  let controller: ServicePropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicePropertiesController],
    }).compile();

    controller = module.get<ServicePropertiesController>(ServicePropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
