import { Injectable } from '@nestjs/common';
import { UserTableService } from '../crud/user-table/user-table.service';
import { TicketsTableService } from '../crud/tickets-table/tickets-table.service';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { ServiceInstancesTableService } from '../crud/service-instances-table/service-instances-table.service';
import { isNil } from 'lodash';
import { updateTicket } from 'src/wrappers/uvdeskWrapper/wrappers/tickets/updateTicket';
import { createTicket } from 'src/wrappers/uvdeskWrapper/wrappers/tickets/createTicket';
import { getListOfTickets } from 'src/wrappers/uvdeskWrapper/wrappers/tickets/getListOfTickets';
import { getTicket } from 'src/wrappers/uvdeskWrapper/wrappers/tickets/getTicket';
import { replyTicket } from 'src/wrappers/uvdeskWrapper/wrappers/tickets/replyTicket';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatusEnum } from './enum/ticket-status.enum';
import { TicketEditType } from './enum/ticket-edit-type.enum';
import { ZammadTicketWrapperService } from '../../../wrappers/zammad-wrapper/services/wrapper/ticket/zammad-ticket-wrapper.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly ticketTable: TicketsTableService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly zammadTicketService: ZammadTicketWrapperService
  ) {}
  async closeTicket(options: SessionRequest, ticketId: number): Promise<void> {
    const userId = options.user.userId;
    const ticketExists = await this.ticketTable.findOne({
      where: {
        userId: userId,
        ticketId: ticketId,
      },
    });
    if (!ticketExists) {
      return Promise.reject(new ForbiddenException());
    }
    // update status to 3
    console.log(ticketId, '💀💀💀');
    await updateTicket(TicketEditType.Status, TicketStatusEnum.Close, ticketId);
    return Promise.resolve();
  }

  async createTicket(
    options: SessionRequest,
    data: CreateTicketDto,
  ): Promise<{ ticketId: number }> {
    console.log('create ticket');
    const userId = options.user.userId;
    const user = await this.userTable.findById(userId);
    const defaultUserId = -1;
    const service = await this.serviceInstancesTable.findOne({
      where: {
        userId: userId | defaultUserId,
        id: data.serviceInstanceId,
      },
    });
    console.log(data);
    if (!service || isNil(data.serviceInstanceId)) {
      return Promise.reject(new ForbiddenException());
    }
    const message = `${data.message}\nنام سرویس: ${
      service.name || ''
    }, نوع سرویس: ${service.serviceTypeId}`;
    const ticket = await this.
    const { ticketId } = await createTicket(
      message,
      'customer',
      null,
      data.name,
      data.subject,
      user.username,
    );
    console.log('🐉🐉🐉');
    await this.ticketTable.create({
      ticketId: ticketId,
      userId: userId,
      serviceInstanceId: data.serviceInstanceId,
    });
    return Promise.resolve({ ticketId });
  }

  async getAllTickets(
    options: SessionRequest,
  ): Promise<{ tickets: object[]; pagination: object }> {
    const userId = options.user.userId;
    const user = await this.userTable.findById(userId);
    const usersTicketsIds = (
      await this.ticketTable.find({
        select: { ticketId: true },
        where: { userId: userId },
      })
    ).map((ticket) => ticket.ticketId);
    const res = [];
    try {
      const tickets = await getListOfTickets({
        actAsEmail: user.username,
        actAsType: 'customer',
      });

      tickets.tickets = tickets.tickets.filter((ticket) =>
        usersTicketsIds.includes(ticket.id),
      );

      return Promise.resolve(tickets);
    } catch (error) {
      if (error.status === 404) {
        return {
          tickets: [],
          pagination: {},
        };
      }
      return Promise.reject(error);
    }
  }

  async getTicket(options: SessionRequest, ticketId: number): Promise<object> {
    const userId = options.user.userId;
    const ticketExists = await this.ticketTable.findOne({
      where: {
        userId: userId,
        ticketId: ticketId,
      },
    });
    if (!ticketExists) {
      return Promise.reject(new ForbiddenException());
    }
    const ticket = await getTicket(ticketId);
    return Promise.resolve(ticket);
  }

  async replyToTicket(
    options: SessionRequest,
    data: { message: string },
    ticketId: number,
  ): Promise<object> {
    const userId = options.user.userId;
    const user = await this.userTable.findById(userId);
    const ticketExists = await this.ticketTable.findOne({
      where: {
        userId: userId,
        ticketId: ticketId,
      },
    });
    if (!ticketExists) {
      return Promise.reject(new ForbiddenException());
    }
    const ticket = await replyTicket(
      ticketId,
      data.message,
      'customer',
      'reply',
      user.username,
      null,
    );
    await updateTicket(
      TicketEditType.Status,
      TicketStatusEnum.Pending,
      ticketId,
    );
    return Promise.resolve(ticket);
  }
}
