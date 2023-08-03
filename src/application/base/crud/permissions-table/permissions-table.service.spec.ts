import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsTableService } from './permissions-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('PermissionsTableService', () => {
  let service: PermissionsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PermissionsTableService, TestDataService],
    }).compile();

    service = module.get<PermissionsTableService>(PermissionsTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
