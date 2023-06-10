import { Test, TestingModule } from '@nestjs/testing';
import { SysdiagramsController } from './sysdiagrams.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { SysdiagramsService } from './sysdiagrams.service';

describe('SysdiagramsController', () => {
  let controller: SysdiagramsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [SysdiagramsService],
      controllers: [SysdiagramsController],
    }).compile();

    controller = module.get<SysdiagramsController>(SysdiagramsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
