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

@Injectable()
export class TicketService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly ticketTable: TicketsTableService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
  ) {}
  async closeTicket(options, ticketId) {
    const userId = options.user.id;
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
    // update status to 3
    console.log(ticketId, '💀💀💀');
    const ticket = await updateTicket('status', 5, ticketId);
    return Promise.resolve();
  }

  async createTicket(options, data) {
    const userId = options.accessToken.userId;
    const user = await this.userTable.findById(userId);
    const service = await this.serviceInstancesTable.findOne({
      where: {
        userId: userId,
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
    return Promise.resolve(ticketId);
  }

  async getAllTickets(options) {
    const userId = options.accessToken.userId;
    const user = await this.userTable.findById(userId);
    try {
      const tickets = await getListOfTickets({
        actAsEmail: user.username,
        actAsType: 'customer',
      });
      return Promise.resolve(tickets);
    } catch (error) {
      if (error.statusCode === 404) {
        return {
          tickets: [],
          pagination: {},
        };
      }
      return Promise.reject(error);
    }
  }

  async getTicket(options, ticketId) {
    const userId = options.accessToken.userId;
    const user = await this.userTable.findById(userId);
    const ticketExists = await this.ticketTable.findOne({
      where: {
        userId: userId,
        ticketId: ticketId,
      },
    });
    if (!ticketExists) {
      return Promise.reject(new ForbiddenException());
      const ticket = await getTicket(ticketId);
      return Promise.resolve(ticket);
    }
  }

  async replyToTicket(options, data, ticketId) {
    const userId = options.accessToken.userId;
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
    return Promise.resolve(ticket);
  }
}
