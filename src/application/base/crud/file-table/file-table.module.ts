import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';
import { FileTableService } from './file-table.service';

@Module({
  imports: [DatabaseModule],
  exports: [FileTableService],
  providers: [FileTableService],
})
export class FileTableModule {}
