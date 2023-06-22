
import { Module } from '@nestjs/common';
import { TicketsTableService } from './tickets-table.service';
//import { TicketsTableController } from './tickets-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TicketsTableService],
  //controllers: [TicketsTableController],
  exports: [TicketsTableService],
})
export class TicketsTableModule {}

			