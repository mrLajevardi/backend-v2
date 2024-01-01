import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { TransactionsController } from './controller/transactions.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/service/user.service';

@Module({
  imports: [DatabaseModule, CrudModule, forwardRef(() => UserModule)],
  providers: [TransactionsService],
  exports: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
