import { Module } from '@nestjs/common';
import { ServicePropertiesTableService } from './service-properties-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { BASE_SERVICE_PROPERTIES_SERVICE } from './interfaces/service-properties.service.interface';

@Module({
  imports: [DatabaseModule],
  providers: [
    ServicePropertiesTableService,

    {
      provide: BASE_SERVICE_PROPERTIES_SERVICE,
      useClass: ServicePropertiesTableService,
    },
  ],
  //controllers: [ServicePropertiesTableController],
  exports: [ServicePropertiesTableService, BASE_SERVICE_PROPERTIES_SERVICE],
})
export class ServicePropertiesTableModule {}
