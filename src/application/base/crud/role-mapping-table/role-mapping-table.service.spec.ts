import { Test, TestingModule } from '@nestjs/testing';
import { RoleMappingTableService } from './role-mapping-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('RoleMappingTableService', () => {
  let service: RoleMappingTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [RoleMappingTableService, TestDataService],
    }).compile();

    service = module.get<RoleMappingTableService>(RoleMappingTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
