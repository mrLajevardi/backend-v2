
import { Module } from '@nestjs/common';
import { OrganizationTableService } from './organization-table.service';
//import { OrganizationTableController } from './organization-table.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [OrganizationTableService],
  //controllers: [OrganizationTableController],
  exports: [OrganizationTableService],
})
export class OrganizationTableModule {}

			