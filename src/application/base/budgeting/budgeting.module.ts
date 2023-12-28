import { forwardRef, Module } from '@nestjs/common';
import { BudgetingService } from './service/budgeting.service';
import { BudgetingController } from './controller/budgeting.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { UserInfoService } from '../user/service/user-info.service';
import { InvoicesModule } from '../invoice/invoices.module';
import { VdcModule } from '../../vdc/vdc.module';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    // InvoicesModule,
    forwardRef(() => InvoicesModule),
    forwardRef(() => VdcModule),
  ],
  controllers: [BudgetingController],
  providers: [BudgetingService, UserInfoService],
  exports: [BudgetingService],
})
export class BudgetingModule {}
