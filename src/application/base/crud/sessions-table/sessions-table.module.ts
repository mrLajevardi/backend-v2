import { Module } from '@nestjs/common';
import { SessionsTableService } from './sessions-table.service';
//import { SessionsTableController } from './sessions-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SessionsTableService],
  //controllers: [SessionsTableController],
  exports: [SessionsTableService],
})
export class SessionsTableModule {}
