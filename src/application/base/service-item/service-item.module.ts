import { Module } from '@nestjs/common';
import { BASE_SERVICE_ITEM_SERVICE } from './interface/service/service-item.interface';
import { ServiceItemsTableModule } from '../crud/service-items-table/service-items-table.module';
import { ServiceItemService } from './service/service-item.service';

@Module({
  imports: [ServiceItemsTableModule],
  providers: [
    {
      provide: BASE_SERVICE_ITEM_SERVICE,
      useClass: ServiceItemService,
    },
  ],
  controllers: [],
  exports: [BASE_SERVICE_ITEM_SERVICE],
})
export class ServiceItemModule {}
