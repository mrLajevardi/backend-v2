import { Test, TestingModule } from '@nestjs/testing';
import { PermissionGroupsMappingsService } from './permission-groups-mappings.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('PermissionGroupsMappingsService', () => {
  let service: PermissionGroupsMappingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PermissionGroupsMappingsService],
    }).compile();

    service = module.get<PermissionGroupsMappingsService>(PermissionGroupsMappingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
