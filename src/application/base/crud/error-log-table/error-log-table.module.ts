
import { Module } from '@nestjs/common';
import { ErrorLogTableService } from './error-log-table.service';
//import { ErrorLogTableController } from './error-log-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ErrorLogTableService],
  //controllers: [ErrorLogTableController],
  exports: [ErrorLogTableService],
})
export class ErrorLogTableModule {}

			