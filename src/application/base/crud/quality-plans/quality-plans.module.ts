import { Module } from '@nestjs/common';
import { QualityPlansService } from './quality-plans.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [QualityPlansService],
  exports: [QualityPlansService],
})
export class QualityPlansModule {}
