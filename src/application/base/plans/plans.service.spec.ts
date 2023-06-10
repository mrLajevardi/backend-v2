import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('PlansService', () => {
  let service: PlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PlansService],
    }).compile();

    service = module.get<PlansService>(PlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
