import { Module } from '@nestjs/common';
import { PermissionsTableService } from './permissions-table.service';
//import { PermissionsTableController } from './permissions-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionsTableService],
  //controllers: [PermissionsTableController],
  exports: [PermissionsTableService],
})
export class PermissionsTableModule {}
