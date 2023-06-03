import { Module } from '@nestjs/common';
import { ServicePropertiesController } from './service-properties.controller';
import { ServicePropertiesService } from './service-properties.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServicePropertiesService],
  controllers: [ServicePropertiesController]
})
export class ServicePropertiesModule {}
