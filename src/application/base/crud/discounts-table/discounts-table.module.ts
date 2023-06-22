
import { Module } from '@nestjs/common';
import { DiscountsTableService } from './discounts-table.service';
//import { DiscountsTableController } from './discounts-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DiscountsTableService],
  //controllers: [DiscountsTableController],
  exports: [DiscountsTableService],
})
export class DiscountsTableModule {}

			