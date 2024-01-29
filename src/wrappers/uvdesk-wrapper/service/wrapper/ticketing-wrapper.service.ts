import { Injectable } from '@nestjs/common';
import { UvDeskWrapperService } from '../uv-desk-wrapper.service';
import { ConfigService } from '@nestjs/config';
import { ActAsTypeEnum } from './enum/act-as-type.enum';
import { UvdeskBooleanEnum } from '../endpoints/enum/uvdesk-boolean.enum';
import * as FormData from 'form-data';
import { LoginKeysEnum } from '../endpoints/enum/login-keys.enum';
import { UpdateCustomerProfileBodyDto } from './interface/update-customer-profile.dto';
import { UpdateCustomerProfileEnum } from '../endpoints/enum/update-customer-profile.enum';
import { CustomerXhrDto } from './interface/customer-xhr.interface';

@Injectable()
export class TicketingWrapperService {
  constructor(
    private readonly uvDeskWrapperService: UvDeskWrapperService,
    private readonly configService: ConfigService,
  ) {}
  async createTicket(
    message,
    actAsType: ActAsTypeEnum,
    actAsEmail,
    name,
    subject,
    from,
  ) {
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

  async login(username: string, password: string): Promise<any> {
    const endpoint = 'loginEndpoint';
    const formData = new FormData();
    formData.append(LoginKeysEnum.Password, password);
    formData.append(LoginKeysEnum.Username, username);
    formData.append(LoginKeysEnum.RememberMe, UvdeskBooleanEnum.True);
    const wrapper =
      this.uvDeskWrapperService.getWrapper<typeof endpoint>(endpoint);
    const result = await this.uvDeskWrapperService.request(
      wrapper({
        body: formData,
        additionalConfigs: {
          withCredentials: true,
          maxRedirects: 0,
          validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
          },
        },
      }),
    );
    return result.headers['set-cookie'];
  }

  async updateCustomerProfile(
    customerId: number,
    dto: UpdateCustomerProfileBodyDto,
    cookie: string,
  ): Promise<void> {
    const formData = new FormData();
    formData.append(UpdateCustomerProfileEnum.Email, dto.email);
    formData.append(UpdateCustomerProfileEnum.FirstName, dto.firstName);
    formData.append(UpdateCustomerProfileEnum.LastName, dto.lastName);
    formData.append(UpdateCustomerProfileEnum.PhoneNumber, dto.contactNumber);
    formData.append(UpdateCustomerProfileEnum.Profile, Buffer.alloc(0));
    formData.append(UpdateCustomerProfileEnum.isActive, dto.isActive);
    const endpoint = 'updateUserProfileEndpoint';
    const wrapper =
      this.uvDeskWrapperService.getWrapper<typeof endpoint>(endpoint);
    await this.uvDeskWrapperService.request(
      wrapper({
        body: formData,
        headers: {
          Cookie: cookie,
        },
        urlParams: {
          customerId,
        },
        additionalConfigs: {
          withCredentials: true,
        },
      }),
    );
  }

  async getCustomer(search: string, cookie: string): Promise<CustomerXhrDto> {
    const endpoint = 'customerXhr';
    const wrapper =
      this.uvDeskWrapperService.getWrapper<typeof endpoint>(endpoint);
    const result = await this.uvDeskWrapperService.request<CustomerXhrDto>(
      wrapper({
        params: {
          search,
        },
        additionalConfigs: {
          withCredentials: true,
          maxRedirects: 0,
          validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
          },
        },
        headers: {
          Cookie: cookie,
        },
      }),
    );
    console.log(result);
    return result.data;
  }
}
