import { Test, TestingModule } from '@nestjs/testing';
import { SettingController } from './setting.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { SettingService } from './setting.service';

describe('SettingController', () => {
  let controller: SettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [SettingService],
      controllers: [SettingController],
    }).compile();

    controller = module.get<SettingController>(SettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
