import { Module } from '@nestjs/common';
import { VReportsUserTableService } from './v-reports-user-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [VReportsUserTableService],
  exports: [VReportsUserTableService],
})
export class VReportsUserModule {}
