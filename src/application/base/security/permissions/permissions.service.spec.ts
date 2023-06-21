import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PermissionsService],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
