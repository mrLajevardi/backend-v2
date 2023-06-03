import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoicePropertiesModule } from './invoice-properties/invoice-properties.module';

@Module({
    imports: [
        DatabaseModule,
        InvoiceModule,
        InvoicePropertiesModule
    ]
})
export class CoreInvoiceModule {}
