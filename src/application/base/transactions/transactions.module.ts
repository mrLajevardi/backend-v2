import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';

@Module({
  imports: [DatabaseModule,CrudModule],
  providers: [TransactionsService],
  controllers: [],
  exports: [TransactionsService],
})
export class TransactionsModule {}
