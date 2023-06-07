import { Module } from '@nestjs/common';
import { AiTransactionsLogsService } from './ai-transactions-logs.service';
import { AiTransactionsLogsController } from './ai-transactions-logs.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AiTransactionsLogsService],
  controllers: [AiTransactionsLogsController],
})
export class AiTransactionsLogsModule {}
