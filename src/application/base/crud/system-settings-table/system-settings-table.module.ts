import { Module } from '@nestjs/common';
import { SystemSettingsTableService } from './system-settings-table.service';
//import { SystemSettingsTableController } from './system-settings-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SystemSettingsTableService],
  //controllers: [SystemSettingsTableController],
  exports: [SystemSettingsTableService],
})
export class SystemSettingsTableModule {}
