import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesController } from './service-instances.controller';

describe('ServiceInstancesController', () => {
  let controller: ServiceInstancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceInstancesController],
    }).compile();

    controller = module.get<ServiceInstancesController>(ServiceInstancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
