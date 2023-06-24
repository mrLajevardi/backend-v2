import { Module } from '@nestjs/common';
import { PermissionMappingsTableService } from './permission-mappings-table.service';
//import { PermissionMappingsTableController } from './permission-mappings-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionMappingsTableService],
  //controllers: [PermissionMappingsTableController],
  exports: [PermissionMappingsTableService],
})
export class PermissionMappingsTableModule {}
