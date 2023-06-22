
import { Module } from '@nestjs/common';
import { UserTableService } from './user-table.service';
//import { UserTableController } from './user-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserTableService],
  //controllers: [UserTableController],
  exports: [UserTableService],
})
export class UserTableModule {}

			