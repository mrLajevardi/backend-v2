import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { ZammadWrapperModule } from '../../../wrappers/zammad-wrapper/zammad-wrapper.module';

@Module({
  imports: [DatabaseModule, CrudModule, ZammadWrapperModule],
  providers: [TicketService],
  exports: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
