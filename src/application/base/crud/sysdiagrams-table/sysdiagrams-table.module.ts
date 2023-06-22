import { Module } from '@nestjs/common';
import { SysdiagramsTableService } from './sysdiagrams-table.service';
//import { sysdiagramsTableController } from './sysdiagrams-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SysdiagramsTableService],
  //controllers: [sysdiagramsTableController],
  exports: [SysdiagramsTableService],
})
export class sysdiagramsTableModule {}
