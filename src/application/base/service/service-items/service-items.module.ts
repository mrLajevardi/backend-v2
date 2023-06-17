import { Module } from '@nestjs/common';
import { ServiceItemsService } from './service-items.service';
import { ServiceItemsController } from './service-items.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceItemsService],
  controllers: [ServiceItemsController],
  exports: [ServiceItemsService]
})
export class ServiceItemsModule {}
