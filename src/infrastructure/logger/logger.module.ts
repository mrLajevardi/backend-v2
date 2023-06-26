import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { DatabaseModule } from '../database/database.module';
import { ErrorLogTableModule } from 'src/application/base/crud/error-log-table/error-log-table.module';
import { DebugLogTableModule } from 'src/application/base/crud/debug-log-table/debug-log-table.module';
import { InfoLogTableModule } from 'src/application/base/crud/info-log-table/info-log-table.module';

@Module({
  imports: [
    DatabaseModule,
    ErrorLogTableModule,
    DebugLogTableModule,
    InfoLogTableModule
  ],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
