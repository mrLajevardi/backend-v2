import { Test, TestingModule } from '@nestjs/testing';
import { ConfigsTableService } from './configs-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ConfigsTableService', () => {
  let service: ConfigsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ConfigsTableService, TestDataService],
    }).compile();

    service = module.get<ConfigsTableService>(ConfigsTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
