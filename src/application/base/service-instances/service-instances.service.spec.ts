import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesController } from './service-instances.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ServiceInstancesService } from './service-instances.service';

describe('ServiceInstancesController', () => {
  let controller: ServiceInstancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceInstancesService],
      controllers: [ServiceInstancesController],
    }).compile();

    controller = module.get<ServiceInstancesController>(ServiceInstancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
