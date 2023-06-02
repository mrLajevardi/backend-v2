import { Module } from '@nestjs/common';
import { ServicePropertiesService } from './service-properties.service';
import { ServicePropertiesController } from './service-properties.controller';
import { ServicePropertiesController } from './service-properties.controller';
import { ServicePropertiesService } from './service-properties.service';

@Module({
  providers: [ServicePropertiesService],
  controllers: [ServicePropertiesController]
})
export class ServicePropertiesModule {}
