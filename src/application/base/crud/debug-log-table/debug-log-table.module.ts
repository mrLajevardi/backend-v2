
import { Module } from '@nestjs/common';
import { DebugLogTableService } from './debug-log-table.service';
//import { DebugLogTableController } from './debug-log-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DebugLogTableService],
  //controllers: [DebugLogTableController],
  exports: [DebugLogTableService],
})
export class DebugLogTableModule {}

			