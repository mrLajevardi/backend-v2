import { Module } from '@nestjs/common';
import { ACLTableService } from './acl-table.service';
//import { ACLTableController } from './acl-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ACLTableService],
  //controllers: [ACLTableController],
  exports: [ACLTableService],
})
export class ACLTableModule {}
