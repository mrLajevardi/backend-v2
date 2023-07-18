import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ServiceController', () => {
  let controller: ServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [],
      controllers: [ServiceController],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
