
import { Module } from '@nestjs/common';
import { PlansTableService } from './plans-table.service';
//import { PlansTableController } from './plans-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { PlansQueryService } from './plans-query.service';

@Module({
  imports: [DatabaseModule],
  providers: [PlansTableService, PlansQueryService],
  //controllers: [PlansTableController],
  exports: [PlansTableService, PlansQueryService],
})
export class PlansTableModule {}

			