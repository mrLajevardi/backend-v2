import { Test, TestingModule } from '@nestjs/testing';
import { EdgeGatewayController } from './edge-gateway.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('EdgeGatewayController', () => {
  let controller: EdgeGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [EdgeGatewayController],
    }).compile();

    controller = module.get<EdgeGatewayController>(EdgeGatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
