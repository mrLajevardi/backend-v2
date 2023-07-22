import { Body, Controller, Param, Get, Post, Request } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';

@Controller('ticket')
export class TicketController {

    constructor(
        private readonly service : TicketService,
    ){}

    @Post('/ticket/:ticketId/close')
    @ApiOperation({ summary: 'close a ticket' })
    @ApiParam({ name: 'ticketId', type: 'number' })
    async closeTicket(
        @Param('ticketId') ticketId: number,
        @Request() options) {
      await this.service.closeTicket(options, ticketId);
    }

    @Post('/ticket')
    @ApiOperation({ summary: 'creates a new ticket' })
    @ApiBody({ type: CreateTicketDto })
    @ApiCreatedResponse({ description: 'The ID of the created ticket', type: Number })
    async createTicket(
        @Body() data: CreateTicketDto,
        @Request() options
    ): Promise<number> {
      const ticketId = await this.service.createTicket(options,data);
      return ticketId;
    }

    @Get('/tickets')
    @ApiOperation({ summary: 'get a list of tickets' })
    async getAllTickets(@Request() options): Promise<any[]> {
      const tickets = await this.service.getAllTickets(options);
      return tickets;
    }

    @Get('/ticket/:ticketId')
    @ApiOperation({ summary: 'get a ticket' })
    @ApiParam({ name: 'ticketId', type: 'number' })
    async getTicket(@Param('ticketId') ticketId: number, @Request() options): Promise<any> {
      const ticket = await this.service.getTicket(options,ticketId);
      return ticket;
    }

    @Post('/ticket/:ticketId/reply')
    @ApiOperation({ summary: 'reply to ticket' })
    @ApiParam({ name: 'ticketId', type: 'number' })
    @ApiBody({ type: ReplyTicketDto }) 
    async replyToTicket(
      @Param('ticketId') ticketId: number,
      @Body() data: ReplyTicketDto,
      @Request() options
    ): Promise<any> {
      const replyData = await this.service.replyToTicket(options,data,ticketId);
      return replyData;
    }
    
}
