
import { Module } from '@nestjs/common';
import { PermissionGroupsTableService } from './permission-groups-table.service';
//import { PermissionGroupsTableController } from './permission-groups-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionGroupsTableService],
  //controllers: [PermissionGroupsTableController],
  exports: [PermissionGroupsTableService],
})
export class PermissionGroupsTableModule {}

			