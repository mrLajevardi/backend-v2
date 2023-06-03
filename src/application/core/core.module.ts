import { Module } from '@nestjs/common';
import { CoreInvoiceModule } from './core-invoice/core-invoice.module';
import { CoreTaskModule } from './core-task/core-task.module';
import { CoreTicketModule } from './core-ticket/core-ticket.module';


@Module({
  imports: [
    CoreInvoiceModule,
    CoreTaskModule,
    CoreTicketModule,
    
  ]
})
export class CoreModule {}
