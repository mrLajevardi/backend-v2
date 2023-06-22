import { Module } from '@nestjs/common';
import { ServiceItemsTableService } from './service-items-table.service';
//import { ServiceItemsTableController } from './service-items-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceItemsTableService],
  //controllers: [ServiceItemsTableController],
  exports: [ServiceItemsTableService],
})
export class ServiceItemsTableModule {}
