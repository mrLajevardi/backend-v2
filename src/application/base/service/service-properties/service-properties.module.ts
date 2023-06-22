import { Module } from '@nestjs/common';
import { ServicePropertiesService } from './service-properties.service';
import { ServicePropertiesController } from './service-properties.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServicePropertiesService],
  controllers: [ServicePropertiesController],
  exports: [ServicePropertiesService],
})
export class ServicePropertiesModule {}
