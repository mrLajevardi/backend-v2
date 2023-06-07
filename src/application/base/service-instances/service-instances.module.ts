import { Module } from '@nestjs/common';
import { ServiceInstancesService } from './service-instances.service';
import { ServiceInstancesController } from './service-instances.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceInstancesService],
  controllers: [ServiceInstancesController],
})
export class ServiceInstancesModule {}
