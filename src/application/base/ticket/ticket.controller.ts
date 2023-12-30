import { Body, Controller, Param, Get, Post, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { CheckPolicies } from '../../base/security/ability/decorators/check-policies.decorator';
import { PureAbility, subject } from '@casl/ability';
import { PolicyHandlerOptions } from '../../base/security/ability/interfaces/policy-handler.interface';
import { AclSubjectsEnum } from '../../base/security/ability/enum/acl-subjects.enum';
import { Action } from '../../base/security/ability/enum/action.enum';

@ApiTags('Tickets')
@ApiBearerAuth()
@CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
  ability.can(Action.Manage, subject(AclSubjectsEnum.Tickets, props)),
)
@Controller('ticket')
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Post('/:ticketId/close')
  @ApiOperation({ summary: 'close a ticket' })
  @ApiParam({ name: 'ticketId', type: 'number' })
  async closeTicket(
    @Param('ticketId') ticketId: number,
    @Request() options: SessionRequest,
  ): Promise<void> {
    await this.service.closeTicket(options, ticketId);
  }

  @Post()
  @ApiOperation({ summary: 'creates a new ticket' })
  @ApiBody({ type: CreateTicketDto })
  @ApiCreatedResponse({
    description: 'The ID of the created ticket',
    type: Number,
  })
  async createTicket(
    @Body() data: CreateTicketDto,
    @Request() options: SessionRequest,
  ): Promise<{ ticketId: number }> {
    const ticketId = await this.service.createTicket(options, data);
    return ticketId;
  }

  @Get()
  @ApiOperation({ summary: 'get a list of tickets' })
  async getAllTickets(
    @Request() options: SessionRequest,
  ): Promise<{ tickets: object[]; pagination: object }> {
    const tickets = await this.service.getAllTickets(options);
    return tickets;
  }

  @Get(':ticketId')
  @ApiOperation({ summary: 'get a ticket' })
  @ApiParam({ name: 'ticketId', type: 'number' })
  async getTicket(
    @Param('ticketId') ticketId: number,
    @Request() options: SessionRequest,
  ): Promise<object> {
    const ticket = await this.service.getTicket(options, ticketId);
    return ticket;
  }

  @Post(':ticketId/reply')
  @ApiOperation({ summary: 'reply to ticket' })
  @ApiParam({ name: 'ticketId', type: 'number' })
  @ApiBody({ type: ReplyTicketDto })
  async replyToTicket(
    @Param('ticketId') ticketId: number,
    @Body() data: ReplyTicketDto,
    @Request() options: SessionRequest,
  ): Promise<any> {
    const replyData = await this.service.replyToTicket(options, data, ticketId);
    return replyData;
  }
}
