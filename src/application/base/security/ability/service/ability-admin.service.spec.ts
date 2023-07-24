import { Test, TestingModule } from '@nestjs/testing';
import { AbilityAdminService } from './ability-admin.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('AbilityAdminService', () => {
  let service: AbilityAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AbilityAdminService],
    }).compile();

    service = module.get<AbilityAdminService>(AbilityAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
