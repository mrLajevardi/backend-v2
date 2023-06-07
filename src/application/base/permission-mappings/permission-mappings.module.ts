import { Module } from '@nestjs/common';
import { PermissionMappingsService } from './permission-mappings.service';
import { PermissionMappingsController } from './permission-mappings.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PermissionMappingsService],
  controllers: [PermissionMappingsController],
})
export class PermissionMappingsModule {}
