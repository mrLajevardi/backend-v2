import { Module } from '@nestjs/common';
import { TemplatesTableService } from './templates-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TemplatesTableService],
  exports: [TemplatesTableService],
})
export class TemplatesTableModule {}
