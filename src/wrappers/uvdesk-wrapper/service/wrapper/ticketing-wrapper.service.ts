import { Injectable } from '@nestjs/common';
import { UvDeskWrapperService } from '../uv-desk-wrapper.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TicketingWrapperService {
  constructor(
    private readonly uvDeskWrapperService: UvDeskWrapperService,
    private readonly configService: ConfigService,
  ) {}
  async createTicket(message, actAsType, actAsEmail, name, subject, from) {
    const endpoint = 'createTicketEndpoint';
    const wrapper =
      this.uvDeskWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ticket = await this.uvDeskWrapperService.request(
      wrapper({
        body: {
          message,
          actAsEmail,
          actAsType,
          name,
          subject,
          from,
        },
        headers: {
          Authorization: this.configService.get<string>('UVDESK_TOKEN'),
        },
      }),
    );
    return ticket.data;
  }
  async getListOfTickets(params) {
    const endpoint = 'getListOfTicketsEndpoint';
    const wrapper =
      this.uvDeskWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ticket = await this.uvDeskWrapperService.request(
      wrapper({
        params,
        headers: {
          Authorization: this.configService.get<string>('UVDESK_TOKEN'),
        },
      }),
    );
    return ticket.data;
  }
  async getTicket(ticketId) {
    const endpoint = 'getTicketEndpoint';
    const wrapper =
      this.uvDeskWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ticket = await this.uvDeskWrapperService.request(
      wrapper({
        headers: {
          Authorization: this.configService.get<string>('UVDESK_TOKEN'),
        },
        urlParams: {
          ticketId,
        },
      }),
    );
    return ticket.data;
  }
  async replyTicket(
    ticketId,
    message,
    actAsType,
    threadType,
    email,
    to = null,
  ) {
    const endpoint = 'replyTicketEndpoint';
    const wrapper =
      this.uvDeskWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ticket = await this.uvDeskWrapperService.request(
      wrapper({
        body: {
          message,
          to,
          actAsType,
          actAsEmail: email,
          threadType,
        },
        headers: {
          Authorization: this.configService.get<string>('UVDESK_TOKEN'),
        },
        urlParams: {
          ticketId,
        },
      }),
    );
    return ticket.data;
  }
  async updateTicket(property, value, ticketId) {
    const endpoint = 'updateTicketEndpoint';
    const wrapper =
      this.uvDeskWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ticket = await this.uvDeskWrapperService.request(
      wrapper({
        body: {
          property,
          value,
        },
        headers: {
          Authorization: this.configService.get<string>('UVDESK_TOKEN'),
        },
        urlParams: {
          ticketId,
        },
      }),
    );
    return ticket.data;
  }
}
