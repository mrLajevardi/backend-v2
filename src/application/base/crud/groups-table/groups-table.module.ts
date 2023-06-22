
import { Module } from '@nestjs/common';
import { GroupsTableService } from './groups-table.service';
//import { GroupsTableController } from './groups-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [GroupsTableService],
  //controllers: [GroupsTableController],
  exports: [GroupsTableService],
})
export class GroupsTableModule {}

			