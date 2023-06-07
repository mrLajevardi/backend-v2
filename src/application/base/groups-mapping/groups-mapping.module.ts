import { Module } from '@nestjs/common';
import { GroupsMappingService } from './groups-mapping.service';
import { GroupsMappingController } from './groups-mapping.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [GroupsMappingService],
  controllers: [GroupsMappingController],
})
export class GroupsMappingModule {}
