import { Module } from '@nestjs/common';
import { InvoicePropertiesService } from './invoice-properties.service';
import { InvoicePropertiesController } from './invoice-properties.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InvoicePropertiesService],
  controllers: [InvoicePropertiesController],
  exports: [InvoicePropertiesService]
})
export class InvoicePropertiesModule {}
