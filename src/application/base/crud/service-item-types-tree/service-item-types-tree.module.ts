import { Module } from '@nestjs/common';
import { ServiceItemTypesTreeService } from './service-item-types-tree.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceItemTypesTreeService],
  exports: [ServiceItemTypesTreeService],
})
export class ServiceItemTypesTreeModule {}
