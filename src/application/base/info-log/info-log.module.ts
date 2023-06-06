import { Module } from '@nestjs/common';
import { InfoLogService } from './info-log.service';
import { InfoLogController } from './info-log.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [InfoLogService],
  controllers: [InfoLogController]
})
export class InfoLogModule {}
