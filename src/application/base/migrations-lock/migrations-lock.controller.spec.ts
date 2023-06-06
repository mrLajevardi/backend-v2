import { Test, TestingModule } from '@nestjs/testing';
import { MigrationsLockService } from './migrations-lock.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('MigrationsLockService', () => {
  let service: MigrationsLockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [MigrationsLockService],
    }).compile();

    service = module.get<MigrationsLockService>(MigrationsLockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
