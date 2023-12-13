import { Test, TestingModule } from '@nestjs/testing';
import { BudgetingController } from './budgeting.controller';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';
import { BudgetingService } from '../service/budgeting.service';

describe('BudgetingController', () => {
  let controller: BudgetingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule],
      controllers: [BudgetingController],
      providers: [BudgetingService],
    }).compile();

    controller = module.get<BudgetingController>(BudgetingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
