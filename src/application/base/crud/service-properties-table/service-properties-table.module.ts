import { Module } from '@nestjs/common';
import { ServicePropertiesTableService } from './service-properties-table.service';
//import { ServicePropertiesTableController } from './service-properties-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServicePropertiesTableService],
  //controllers: [ServicePropertiesTableController],
  exports: [ServicePropertiesTableService],
})
export class ServicePropertiesTableModule {}
