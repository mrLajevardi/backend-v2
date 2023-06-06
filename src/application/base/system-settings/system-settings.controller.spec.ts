import { Test, TestingModule } from '@nestjs/testing';
import { SystemSettingsService } from './system-settings.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('SystemSettingsService', () => {
  let service: SystemSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [SystemSettingsService],
    }).compile();

    service = module.get<SystemSettingsService>(SystemSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
