import { Module } from '@nestjs/common';
import { InvoicesModule } from './invoices/invoices.module';
import { TicketsModule } from './tickets/tickets.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [InvoicesModule, TicketsModule, TasksModule]
})
export class CoreModule {}
