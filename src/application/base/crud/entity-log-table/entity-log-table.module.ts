import { Module } from '@nestjs/common';
import { EntityLogTableService } from './entity-log-table.service';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [EntityLogTableService],
  exports: [EntityLogTableService],
})
export class EntityLogTableModule {}
