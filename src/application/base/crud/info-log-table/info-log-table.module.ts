
import { Module } from '@nestjs/common';
import { InfoLogTableService } from './info-log-table.service';
//import { InfoLogTableController } from './info-log-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InfoLogTableService],
  //controllers: [InfoLogTableController],
  exports: [InfoLogTableService],
})
export class InfoLogTableModule {}

			