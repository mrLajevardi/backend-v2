import { Test, TestingModule } from '@nestjs/testing';
import { ScopeService } from './scope.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ScopeService', () => {
  let service: ScopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ScopeService],
    }).compile();

    service = module.get<ScopeService>(ScopeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
