import { Module } from '@nestjs/common';
import { PermissionGroupsService } from './permission-groups.service';
import { PermissionGroupsController } from './permission-groups.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionGroupsService],
  controllers: [PermissionGroupsController],
  exports: [PermissionGroupsService]
})
export class PermissionGroupsModule {}
