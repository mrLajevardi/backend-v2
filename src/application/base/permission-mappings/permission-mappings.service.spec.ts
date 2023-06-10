import { Test, TestingModule } from '@nestjs/testing';
import { PermissionMappingsService } from './permission-mappings.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('PermissionMappingsService', () => {
  let service: PermissionMappingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PermissionMappingsService],
    }).compile();

    service = module.get<PermissionMappingsService>(PermissionMappingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
