import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CostCalculationService } from './cost-calculation.service';
import { InvoicesChecksService } from './invoices-checks.service';
import { InvoicesCreatesService } from './invoices-creates.service';
import { CreateInvoiceService } from './create-invoice.service';

@Module({
  imports: [DatabaseModule],
  providers: [InvoicesService, CostCalculationService, InvoicesChecksService, InvoicesCreatesService, CreateInvoiceService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
