
import { Module } from '@nestjs/common';
import { ServiceTypesTableService } from './service-types-table.service';
//import { ServiceTypesTableController } from './service-types-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ServiceTypesTableService],
  //controllers: [ServiceTypesTableController],
  exports: [ServiceTypesTableService],
})
export class ServiceTypesTableModule {}

			