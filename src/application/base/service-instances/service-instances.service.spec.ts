import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancessController } from './service-instances.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ServiceInstancessService } from './service-instances.service';

describe('ServiceInstancessController', () => {
  let controller: ServiceInstancessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceInstancessService],
      controllers: [ServiceInstancessController],
    }).compile();

    controller = module.get<ServiceInstancessController>(ServiceInstancessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
