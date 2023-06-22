import { Module } from '@nestjs/common';
import { ItemTypesTableService } from './item-types-table.service';
//import { ItemTypesTableController } from './item-types-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ItemTypesTableService],
  //controllers: [ItemTypesTableController],
  exports: [ItemTypesTableService],
})
export class ItemTypesTableModule {}
