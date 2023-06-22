import { Module } from '@nestjs/common';
import { TasksTableService } from './tasks-table.service';
//import { TasksTableController } from './tasks-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TasksTableService],
  //controllers: [TasksTableController],
  exports: [TasksTableService],
})
export class TasksTableModule {}
