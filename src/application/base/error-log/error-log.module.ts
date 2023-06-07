import { Module } from '@nestjs/common';
import { ErrorLogService } from './error-log.service';
import { ErrorLogController } from './error-log.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ErrorLogService],
  controllers: [ErrorLogController],
})
export class ErrorLogModule {}
