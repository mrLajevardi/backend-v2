import { Module } from '@nestjs/common';
import { ServiceInstancesService } from './service-instances.service';
import { ServiceInstancesController } from './service-instances.controller';

@Module({
  providers: [ServiceInstancesService],
  controllers: [ServiceInstancesController]
})
export class ServiceInstancesModule {}
