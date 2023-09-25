import { Module } from '@nestjs/common';
import { ServiceItemTypesTreeService } from './service-item-types-tree.service';

@Module({
  providers: [ServiceItemTypesTreeService]
})
export class ServiceItemTypesTreeModule {}
