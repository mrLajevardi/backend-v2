import { Module } from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { SystemSettingsController } from './system-settings.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SystemSettingsService],
  controllers: [SystemSettingsController],
  exports: [SystemSettingsService],
})
export class SystemSettingsModule {}
