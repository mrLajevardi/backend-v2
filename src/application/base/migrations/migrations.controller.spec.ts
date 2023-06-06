import { Test, TestingModule } from '@nestjs/testing';
import { MigrationsService } from './migrations.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('MigrationsService', () => {
  let service: MigrationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [MigrationsService],
    }).compile();

    service = module.get<MigrationsService>(MigrationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
