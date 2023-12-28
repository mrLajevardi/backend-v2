import { Module } from '@nestjs/common';
import { CompanyTableService } from './company-table.service';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CompanyTableService],
  exports: [CompanyTableService],
})
export class CompanyTableModule {}
