import { Test, TestingModule } from '@nestjs/testing';
import { SecurityToolsService } from './security-tools.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('SecurityToolsService', () => {
  let service: SecurityToolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [SecurityToolsService],
    }).compile();

    service = module.get<SecurityToolsService>(SecurityToolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
