import { Test, TestingModule } from '@nestjs/testing';
import { BudgetingService } from './budgeting.service';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';

describe('BudgetingService', () => {
  let service: BudgetingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule],
      providers: [BudgetingService],
    }).compile();

    service = module.get<BudgetingService>(BudgetingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
