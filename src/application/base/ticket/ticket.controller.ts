import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Request,
  Header,
  Response,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
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
import { ArticleReactionDto } from './dto/article-rection.dto';
import { ArticleListDto } from './dto/article-list.dto';
import { TicketListDto } from './dto/ticket-list.dto';
import { Response as rs } from 'express';
import axios from 'axios';
import { CreateArticleResultDto } from '../../../wrappers/zammad-wrapper/services/wrapper/ticket/dto/create-article.dto';

@ApiTags('Tickets')
@ApiBearerAuth()
// @CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
//   ability.can(Action.Manage, subject(AclSubjectsEnum.Tickets, props)),
// )
@Controller('ticket')
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Post('/:ticketId/close')
  @ApiOperation({ summary: 'close a ticket' })
  @ApiParam({ name: 'ticketId', type: Number })
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
  @ApiResponse({
    type: [TicketListDto],
  })
  async getAllTickets(@Request() options: SessionRequest): Promise<any> {
    const tickets = await this.service.getAllTickets(options);
    return tickets;
  }

  @Get(':ticketId')
  @ApiOperation({ summary: 'get a ticket' })
  @ApiParam({ name: 'ticketId', type: Number })
  @ApiResponse({ type: [ArticleListDto] })
  async getTicket(
    @Param('ticketId') ticketId: number,
    @Request() options: SessionRequest,
  ): Promise<object> {
    const ticket = await this.service.getTicket(options, ticketId);
    return ticket;
  }

  @Get(':ticketId/:articleId/:attachmentId')
  @ApiOperation({ summary: 'get an attachment' })
  @ApiParam({ name: 'ticketId', type: Number })
  @ApiParam({ name: 'articleId', type: Number })
  @ApiParam({ name: 'attachmentId', type: Number })
  @ApiResponse({ type: [ArticleListDto] })
  // @Header('Content-Type', 'image/png')
  // @Header('Content-Length', '13318')
  // @Header('Content-Transfer-Encoding', 'binary')
  // @Header('Content-Disposition', `inline; filename="hi"; filename*=UTF-8''hi`)
  // @Header('X-Download-Options', `noopen`)
  async getAttachment(
    @Param('ticketId') ticketId: number,
    @Param('articleId') articleId: number,
    @Param('attachmentId') attachmentId: number,
    @Request() options: SessionRequest,
    @Response() res: rs,
  ): Promise<any> {
    const ticket = await this.service.getAttachment(
      options,
      ticketId,
      articleId,
      attachmentId,
    );
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename=image.png');
    res.send(ticket);
  }

  @Post(':ticketId/reply')
  @ApiOperation({ summary: 'reply to ticket' })
  @ApiResponse({ type: ArticleListDto })
  @ApiParam({ name: 'ticketId', type: Number })
  async replyToTicket(
    @Param('ticketId') ticketId: number,
    @Body() data: ReplyTicketDto,
    @Request() options: SessionRequest,
  ): Promise<CreateArticleResultDto> {
    const replyData = await this.service.replyToTicket(options, data, ticketId);
    return replyData;
  }

  @Post(':ticketId/reaction')
  @ApiParam({ name: 'ticketId', type: Number })
  @ApiOperation({ summary: 'react to ticket' })
  async reactToArticle(
    @Param('ticketId') ticketId: number,
    @Body() data: ArticleReactionDto,
    @Request() options: SessionRequest,
  ): Promise<void> {
    await this.service.articleReaction(data, ticketId, options);
  }
}
