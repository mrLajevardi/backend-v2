import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { InvoicePropertiesController } from './invoice-properties.controller';
import { InvoicePropertiesService } from './invoice-properties.service';

@Module({
  imports: [DatabaseModule],
  controllers: [InvoicePropertiesController],
  providers: [InvoicePropertiesService],
})
export class InvoicePropertiesModule {}
