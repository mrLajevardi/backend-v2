import { Module } from '@nestjs/common';
import { BudgetingService } from './service/budgeting.service';
import { BudgetingController } from './controller/budgeting.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';

@Module({
  imports: [DatabaseModule, CrudModule],
  controllers: [BudgetingController],
  providers: [BudgetingService],
})
export class BudgetingModule {}
