import { Test, TestingModule } from '@nestjs/testing';
import { RoleTableService } from './role-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('RoleTableService', () => {
  let service: RoleTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [RoleTableService, TestDataService],
    }).compile();

    service = module.get<RoleTableService>(RoleTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
