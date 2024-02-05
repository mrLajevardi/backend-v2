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
import { ZammadUserWrapperService } from '../../../wrappers/zammad-wrapper/services/wrapper/user/zammad-users-wrapper.service';
import { ZammadGroupsEnum } from '../../../wrappers/zammad-wrapper/services/wrapper/user/enum/zammad-groups.enum';
import { ZammadRolesEnum } from '../../../wrappers/zammad-wrapper/services/wrapper/user/enum/zammad-roles.enum';
import { User } from '../../../infrastructure/database/entities/User';
import { encodePassword } from '../../../wrappers/zammad-wrapper/services/helper/encode-password.helper';
import { ZammadArticleTypeEnum } from '../../../wrappers/zammad-wrapper/services/wrapper/ticket/enum/zammad-article-type.enum';

@Injectable()
export class TicketService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly ticketTable: TicketsTableService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly zammadTicketService: ZammadTicketWrapperService,
    private readonly zammadUserService: ZammadUserWrapperService,
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
    // if (!service || isNil(data.serviceInstanceId)) {
    //   return Promise.reject(new ForbiddenException());
    // }
    // const message = `${data.message}\nنام سرویس: ${
    //   service?.name ?? ''
    // }, نوع سرویس: ${service?.serviceTypeId}`;
    const zammadUser = await this.zammadUserService.searchUser(user.guid);
    if (zammadUser.length === 0) {
      await this.createTicketingUser(user);
    }
    const ticket = await this.zammadTicketService.createTicket(
      {
        title: data.subject,
        group: ZammadGroupsEnum.Users,
      },
      encodePassword(user.guid),
    );
    await this.zammadTicketService.articleService.createArticle(
      {
        body: data.message,
        ticket_id: ticket.id,
        type: ZammadArticleTypeEnum.Note,
      },
      encodePassword(user.guid),
    );
    // const { ticketId } = await createTicket(
    //   message,
    //   'customer',
    //   null,
    //   data.name,
    //   data.subject,
    //   user.username,
    // );
    console.log('🐉🐉🐉');
    await this.ticketTable.create({
      ticketId: ticket.id,
      userId: userId,
      serviceInstanceId: data.serviceInstanceId ?? null,
    });
    return Promise.resolve({ ticketId: ticket.id });
  }

  async getAllTickets(
    options: SessionRequest,
  ): Promise<{ tickets: object[]; pagination: object }> {
    const userId = options.user.userId;
    const user = await this.userTable.findById(userId);
    const tickets = await this.zammadTicketService.getAllTickets(
      encodePassword(user.guid),
    );
    return tickets as any;
    const usersTicketsIds = (
      await this.ticketTable.find({
        select: { ticketId: true },
        where: { userId: userId },
      })
    ).map((ticket) => ticket.ticketId);
    const res = [];
    // try {
    //   const tickets = await getListOfTickets({
    //     actAsEmail: user.username,
    //     actAsType: 'customer',
    //   });

    //   tickets.tickets = tickets.tickets.filter((ticket) =>
    //     usersTicketsIds.includes(ticket.id),
    //   );

    //   return Promise.resolve(tickets);
    // } catch (error) {
    //   if (error.status === 404) {
    //     return {
    //       tickets: [],
    //       pagination: {},
    //     };
    //   }
    //   return Promise.reject(error);
    // }
  }

  async getTicket(options: SessionRequest, ticketId: number): Promise<object> {
    const userGuid = options.user.guid;
    // const ticketExists = await this.ticketTable.findOne({
    //   where: {
    //     userId: userId,
    //     ticketId: ticketId,
    //   },
    // });
    // if (!ticketExists) {
    //   return Promise.reject(new ForbiddenException());
    // }
    const ticket = await this.zammadTicketService.articleService.getArticle(
      ticketId,
      encodePassword(userGuid),
    );
    return Promise.resolve(ticket);
  }

  async replyToTicket(
    options: SessionRequest,
    data: { message: string },
    ticketId: number,
  ): Promise<void> {
    await this.zammadTicketService.articleService.createArticle(
      {
        body: data.message,
        ticket_id: ticketId,
        type: ZammadArticleTypeEnum.Note,
      },
      encodePassword(options.user.guid),
    );
  }

  private async createTicketingUser(user: User): Promise<void> {
    await this.zammadUserService.createUser({
      email: user.email,
      firstname: user.name,
      lastname: user.family,
      login: user.guid,
      organization: null,
      password: process.env.ZAMMAD_USER_PASSWORD,
      roles: [ZammadRolesEnum.Customer],
    });
  }
}
