import { Test, TestingModule } from '@nestjs/testing';
import { ServicePropertiesController } from './service-properties.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ServicePropertiesService } from './service-properties.service';

describe('ServicePropertiesController', () => {
  let controller: ServicePropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServicePropertiesService],
      controllers: [ServicePropertiesController],
    }).compile();

    controller = module.get<ServicePropertiesController>(ServicePropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
