import { Test, TestingModule } from '@nestjs/testing';
import { SysdiagramsTableService } from './sysdiagrams-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('sysdiagramsTableService', () => {
  let service: SysdiagramsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [SysdiagramsTableService, TestDataService],
    }).compile();

    service = module.get<SysdiagramsTableService>(SysdiagramsTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
