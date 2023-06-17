import { Module } from '@nestjs/common';
import { ServiceTypesService } from './service-types.service';
import { ServiceTypesController } from './service-types.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceTypesService],
  controllers: [ServiceTypesController],
  exports: [ServiceTypesService],

})
export class ServiceTypesModule {}
