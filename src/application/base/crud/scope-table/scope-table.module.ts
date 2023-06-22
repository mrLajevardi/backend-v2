import { Module } from '@nestjs/common';
import { ScopeTableService } from './scope-table.service';
//import { ScopeTableController } from './scope-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ScopeTableService],
  //controllers: [ScopeTableController],
  exports: [ScopeTableService],
})
export class ScopeTableModule {}
