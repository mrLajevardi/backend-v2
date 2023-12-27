import { Test, TestingModule } from '@nestjs/testing';
import { BudgetingController } from './budgeting.controller';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';
import { BudgetingService } from '../service/budgeting.service';
import { UserModule } from '../../user/user.module';
import { ServiceModule } from '../../service/service.module';
import { VdcModule } from '../../../vdc/vdc.module';
import { InvoicesModule } from '../../invoice/invoices.module';

describe('BudgetingController', () => {
  let controller: BudgetingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        UserModule,
        ServiceModule,
        InvoicesModule,
        VdcModule,
      ],
      controllers: [BudgetingController],
      providers: [BudgetingService],
    }).compile();

    controller = module.get<BudgetingController>(BudgetingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
