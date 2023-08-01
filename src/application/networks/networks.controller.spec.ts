import { Test, TestingModule } from '@nestjs/testing';
import { NetworksController } from './networks.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('NetworksController', () => {
  let controller: NetworksController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [NetworksController],
    }).compile();

    controller = module.get<NetworksController>(NetworksController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
