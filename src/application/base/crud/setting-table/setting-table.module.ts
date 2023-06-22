
import { Module } from '@nestjs/common';
import { SettingTableService } from './setting-table.service';
//import { SettingTableController } from './setting-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SettingTableService],
  //controllers: [SettingTableController],
  exports: [SettingTableService],
})
export class SettingTableModule {}

			