import { Test, TestingModule } from '@nestjs/testing';
import { SessionsTableService } from './sessions-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('SessionsTableService', () => {
  let service: SessionsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [SessionsTableService, TestDataService],
    }).compile();

    service = module.get<SessionsTableService>(SessionsTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
