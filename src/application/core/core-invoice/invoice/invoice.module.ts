import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
    imports: [DatabaseModule],
    controllers: [InvoiceController],
    providers: [InvoiceService]
})
export class InvoiceModule {}
