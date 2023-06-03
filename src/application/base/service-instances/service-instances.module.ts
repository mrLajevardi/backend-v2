import { Module } from '@nestjs/common';
import { ServiceInstancesService } from './service-instances.service';
import { ServiceInstancesController } from './service-instances.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [ServiceInstancesService],
  controllers: [ServiceInstancesController]
})
export class ServiceInstancesModule {}
