
import { Module } from '@nestjs/common';
import { RoleMappingTableService } from './role-mapping-table.service';
//import { RoleMappingTableController } from './role-mapping-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RoleMappingTableService],
  //controllers: [RoleMappingTableController],
  exports: [RoleMappingTableService],
})
export class RoleMappingTableModule {}

			