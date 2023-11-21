import { Module } from '@nestjs/common';
import { CompanyController } from './controller/company.controller';
import { CompanyService } from './service/company.service';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';

@Module({
  imports: [DatabaseModule, CrudModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
