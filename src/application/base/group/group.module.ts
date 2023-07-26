import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { GroupsTableModule } from '../crud/groups-table/groups-table.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';

@Module({
  imports: [DatabaseModule, CrudModule, GroupsTableModule, LoggerModule],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
