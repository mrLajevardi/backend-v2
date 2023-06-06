import { Test, TestingModule } from '@nestjs/testing';
import { ConfigsService } from './configs.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ConfigsService', () => {
  let service: ConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ConfigsService],
    }).compile();

    service = module.get<ConfigsService>(ConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
