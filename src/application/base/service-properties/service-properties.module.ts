import { Module } from '@nestjs/common';
import { ServicePropertiesService } from './service-properties.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
  ],
  providers: [ServicePropertiesService],
  exports: [ServicePropertiesService]
})
export class ServicePropertiesModule {}
