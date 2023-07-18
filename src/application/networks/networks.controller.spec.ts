import { Test, TestingModule } from '@nestjs/testing';
import { NetworksController } from './networks.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('NetworksController', () => {
  let controller: NetworksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [NetworksController],
    }).compile();

    controller = module.get<NetworksController>(NetworksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
