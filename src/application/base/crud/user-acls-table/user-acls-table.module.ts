import { Module } from '@nestjs/common';
import { UserAclsTableService } from './user-acls-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserAclsTableService],
  exports: [UserAclsTableService],
})
export class UserAclsTableModule {}
