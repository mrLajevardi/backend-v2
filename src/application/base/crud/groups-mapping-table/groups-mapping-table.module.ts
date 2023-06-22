import { Module } from '@nestjs/common';
import { GroupsMappingTableService } from './groups-mapping-table.service';
//import { GroupsMappingTableController } from './groups-mapping-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [GroupsMappingTableService],
  //controllers: [GroupsMappingTableController],
  exports: [GroupsMappingTableService],
})
export class GroupsMappingTableModule {}
