import { Module } from '@nestjs/common';
import { RoleMappingService } from './role-mapping.service';
import { RoleMappingController } from './role-mapping.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RoleMappingService],
  controllers: [RoleMappingController],
})
export class RoleMappingModule {}
