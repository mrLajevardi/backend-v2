import { Test, TestingModule } from '@nestjs/testing';
import { PermissionGroupsService } from './permission-groups.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('PermissionGroupsService', () => {
  let service: PermissionGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PermissionGroupsService],
    }).compile();

    service = module.get<PermissionGroupsService>(PermissionGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
