import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';

@Module({
  imports: [DatabaseModule, CrudModule],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
