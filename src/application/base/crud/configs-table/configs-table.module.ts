import { Module } from '@nestjs/common';
import { ConfigsTableService } from './configs-table.service';
//import { ConfigsTableController } from './configs-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ConfigsTableService],
  //controllers: [ConfigsTableController],
  exports: [ConfigsTableService],
})
export class ConfigsTableModule {}
