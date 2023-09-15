import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DataCenterTableService } from './data-center-table.service';

@Module({
  imports: [DatabaseModule],
  providers: [DataCenterTableService],
  //controllers: [ConfigsTableController],
  exports: [DataCenterTableService],
})
export class DatacenterTableModule {}
