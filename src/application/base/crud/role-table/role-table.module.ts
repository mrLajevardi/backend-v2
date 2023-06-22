import { Module } from '@nestjs/common';
import { RoleTableService } from './role-table.service';
//import { RoleTableController } from './role-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RoleTableService],
  //controllers: [RoleTableController],
  exports: [RoleTableService],
})
export class RoleTableModule {}
