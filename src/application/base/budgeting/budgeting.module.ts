import { Module } from '@nestjs/common';
import { BudgetingService } from './service/budgeting.service';
import { BudgetingController } from './controller/budgeting.controller';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { UserInfoService } from '../user/service/user-info.service';
import { ServiceChecksService } from '../service/services/service-checks.service';

@Module({
  imports: [DatabaseModule, CrudModule],
  controllers: [BudgetingController],
  providers: [BudgetingService, UserInfoService, ServiceChecksService],
  exports: [BudgetingService],
})
export class BudgetingModule {}
