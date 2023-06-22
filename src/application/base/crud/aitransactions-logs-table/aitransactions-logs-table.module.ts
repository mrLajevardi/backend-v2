import { Module } from '@nestjs/common';
import { AITransactionsLogsTableService } from './aitransactions-logs-table.service';
//import { AITransactionsLogsTableController } from './aitransactions-logs-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { AitransactionsLogsStoredProcedureService } from './aitransactions-logs-stored-procedure.service';
import { CrudModule } from '../crud.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    AITransactionsLogsTableService,
    AitransactionsLogsStoredProcedureService,
  ],
  //controllers: [AITransactionsLogsTableController],
  exports: [
    AITransactionsLogsTableService,
    AitransactionsLogsStoredProcedureService,
  ],
})
export class AITransactionsLogsTableModule {}
