import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { TransactionsController } from './controller/transactions.controller';

@Module({
  imports: [DatabaseModule, CrudModule],
  providers: [TransactionsService],
  exports: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
