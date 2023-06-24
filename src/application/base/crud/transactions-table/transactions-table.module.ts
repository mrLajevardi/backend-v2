import { Module } from '@nestjs/common';
import { TransactionsTableService } from './transactions-table.service';
//import { TransactionsTableController } from './transactions-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TransactionsTableService],
  //controllers: [TransactionsTableController],
  exports: [TransactionsTableService],
})
export class TransactionsTableModule {}
