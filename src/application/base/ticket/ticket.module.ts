import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { WrapperModule } from '../../../wrappers/wrapper.module';

@Module({
  imports: [DatabaseModule, CrudModule, WrapperModule],
  providers: [TicketService],
  exports: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
