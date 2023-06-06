import { Test, TestingModule } from '@nestjs/testing';
import { SettingService } from './setting.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('SettingService', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [SettingService],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
