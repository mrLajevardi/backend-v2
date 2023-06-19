import { Module } from '@nestjs/common';
import { DebugLogService } from './debug-log.service';
import { DebugLogController } from './debug-log.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DebugLogService],
  controllers: [DebugLogController],
  exports: [DebugLogService],
})
export class DebugLogModule {}
