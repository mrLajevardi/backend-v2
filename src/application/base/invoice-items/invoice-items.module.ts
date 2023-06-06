import { Module } from '@nestjs/common';
import { InvoiceItemsService } from './invoice-items.service';
import { InvoiceItemsController } from './invoice-items.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [InvoiceItemsService],
  controllers: [InvoiceItemsController]
})
export class InvoiceItemsModule {}
