import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserTableService } from '../crud/user-table/user-table.service';
import { TicketsTableService } from '../crud/tickets-table/tickets-table.service';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { ServiceInstancesTableService } from '../crud/service-instances-table/service-instances-table.service';
import { isNil, set } from 'lodash';
import { updateTicket } from 'src/wrappers/uvdeskWrapper/wrappers/tickets/updateTicket';
import { createTicket } from 'src/wrappers/uvdeskWrapper/wrappers/tickets/createTicket';
import { getListOfTickets } from 'src/wrappers/uvdeskWrapper/wrappers/tickets/getListOfTickets';
import { getTicket } from 'src/wrappers/uvdeskWrapper/wrappers/tickets/getTicket';
import { replyTicket } from 'src/wrappers/uvdeskWrapper/wrappers/tickets/replyTicket';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatusEnum } from './enum/ticket-status.enum';
import { TicketEditType } from './enum/ticket-edit-type.enum';
import { TicketingWrapperService } from '../../../wrappers/uvdesk-wrapper/service/wrapper/ticketing-wrapper.service';
import * as setCookieParser from 'set-cookie-parser';
import { ILoginSession } from '../../../wrappers/uvdesk-wrapper/service/wrapper/interface/login-session.interface';
import { UpdateCustomerProfileBodyDto } from '../../../wrappers/uvdesk-wrapper/service/wrapper/interface/update-customer-profile.dto';
import { UvdeskBooleanEnum } from '../../../wrappers/uvdesk-wrapper/service/endpoints/enum/uvdesk-boolean.enum';

@Injectable()
export class TicketService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly ticketTable: TicketsTableService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly ticketWrapperService: TicketingWrapperService,
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
      user.name,
      data.subject,
      user.guid,
    );
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
    try {
      const tickets = await getListOfTickets({
        actAsEmail: user.guid,
        actAsType: 'customer',
      });
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
    const cookie = await this.login();
    await this.updateProfile('lajevardi321@gmail.com', cookie, {
      contactNumber: '',
      email: '304888AD-FB7C-4F54-AC9F-A1CDEF72539E',
      firstName: 'ali',
      isActive: UvdeskBooleanEnum.True,
      lastName: 'laj',
    });
    console.log(cookie);
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
      user.guid,
      null,
    );
    return Promise.resolve(ticket);
  }

  async login(): Promise<string> {
    const cookie = await this.ticketWrapperService.login(
      process.env.UVDESK_ADMIN_USERNAME,
      process.env.UVDESK_ADMIN_PASSWORD,
    );

    const parsedCookie: ILoginSession[] = setCookieParser(cookie);
    return `${parsedCookie[0].name}=${parsedCookie[0].value}`;
  }

  async updateProfile(
    userGuid: string,
    cookie: string,
    dto: UpdateCustomerProfileBodyDto,
  ): Promise<void> {
    const customer = await this.ticketWrapperService.getCustomer(
      userGuid,
      cookie,
    );
    if (
      customer.customers.length === 0 ||
      customer.customers[0].email !== userGuid
    ) {
      throw new InternalServerErrorException();
    }
    const targetCustomer = customer.customers[0];
    await this.ticketWrapperService.updateCustomerProfile(
      targetCustomer.id,
      {
        contactNumber: dto.contactNumber,
        email: dto.email,
        firstName: dto.firstName,
        isActive: dto.isActive,
        lastName: dto.lastName,
      },
      cookie,
    );
  }
}
