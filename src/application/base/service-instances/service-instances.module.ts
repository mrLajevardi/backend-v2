import { Module } from '@nestjs/common';
import { ServiceInstancesService } from './service-instances.service';
import { ServiceInstancesController } from './service-instances.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ServiceTypesService } from '../service-types/service-types.service';
import { ServiceTypesModule } from '../service-types/service-types.module';

@Module({
  imports: [
    DatabaseModule,
    ServiceTypesModule
  ],
  providers: [
    ServiceInstancesService,
    ServiceTypesService,
  ],
  controllers: [ServiceInstancesController],
})
export class ServiceInstancesModule {}
