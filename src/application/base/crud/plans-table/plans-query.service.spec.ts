import { Test, TestingModule } from '@nestjs/testing';
import { PlansQueryService } from './plans-query.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('PlansQueryService', () => {
  let service: PlansQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PlansQueryService],
    }).compile();

    service = module.get<PlansQueryService>(PlansQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
