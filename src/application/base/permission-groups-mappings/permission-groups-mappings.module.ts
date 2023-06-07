import { Module } from '@nestjs/common';
import { PermissionGroupsMappingsService } from './permission-groups-mappings.service';
import { PermissionGroupsMappingsController } from './permission-groups-mappings.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionGroupsMappingsService],
  controllers: [PermissionGroupsMappingsController],
})
export class PermissionGroupsMappingsModule {}
