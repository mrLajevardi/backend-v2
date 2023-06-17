import { Test, TestingModule } from '@nestjs/testing';
import { ConfigsController } from './configs.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ConfigsService } from './configs.service';

describe('ConfigsController', () => {
  let controller: ConfigsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ConfigsService],
      controllers: [ConfigsController],
    }).compile();

    controller = module.get<ConfigsController>(ConfigsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
