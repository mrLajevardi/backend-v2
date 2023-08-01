import { Test, TestingModule } from '@nestjs/testing';
import { EdgeGatewayController } from './edge-gateway.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('EdgeGatewayController', () => {
  let controller: EdgeGatewayController;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [EdgeGatewayController],
    }).compile();

    controller = module.get<EdgeGatewayController>(EdgeGatewayController);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
