import { Test, TestingModule } from '@nestjs/testing';
import { EdgeGatewayController } from './edge-gateway.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('EdgeGatewayController', () => {
  let controller: EdgeGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [EdgeGatewayController],
    }).compile();

    controller = module.get<EdgeGatewayController>(EdgeGatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
