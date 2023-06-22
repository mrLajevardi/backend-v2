
import { Module } from '@nestjs/common';
import { PermissionGroupsMappingsTableService } from './permission-groups-mappings-table.service';
//import { PermissionGroupsMappingsTableController } from './permission-groups-mappings-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionGroupsMappingsTableService],
  //controllers: [PermissionGroupsMappingsTableController],
  exports: [PermissionGroupsMappingsTableService],
})
export class PermissionGroupsMappingsTableModule {}

			