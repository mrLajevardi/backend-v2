import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenTableService } from './access-token-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('AccessTokenTableService', () => {
  let service: AccessTokenTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [AccessTokenTableService],
    }).compile();

    service = module.get<AccessTokenTableService>(AccessTokenTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
