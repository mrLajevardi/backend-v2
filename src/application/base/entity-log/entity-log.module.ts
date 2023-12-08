import { Module } from '@nestjs/common';
import { EntityLogController } from './entity-log.controller';
import { EntityLogService } from './service/entity-log.service';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';

@Module({
  imports: [DatabaseModule, CrudModule],
  controllers: [EntityLogController],
  providers: [EntityLogService],
})
export class EntityLogModule {}
