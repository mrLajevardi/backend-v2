import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DeleteServiceService } from '../services/delete-service.service';
import { CreateServiceService } from '../services/create-service.service';

describe('ServiceController', () => {
  let controller: ServiceController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [DeleteServiceService, CreateServiceService],
      controllers: [ServiceController],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
