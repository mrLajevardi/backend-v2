import { Test, TestingModule } from '@nestjs/testing';
import { NetworksController } from './networks.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('NetworksController', () => {
  let controller: NetworksController;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [NetworksController],
    }).compile();

    controller = module.get<NetworksController>(NetworksController);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
