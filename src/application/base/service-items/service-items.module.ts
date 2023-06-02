import { Module } from '@nestjs/common';
import { ServiceItemsService } from './service-items.service';
import { ServiceItemsController } from './service-items.controller';

@Module({
  providers: [ServiceItemsService],
  controllers: [ServiceItemsController]
})
export class ServiceItemsModule {}
