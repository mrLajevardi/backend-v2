import { Injectable } from '@nestjs/common';
import { EndpointInterface } from '../../../interfaces/endpoint.interface';
import { AdminPanelLoginDto } from './dto/admin-panel-login.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';
import { CustomerXhrDto } from './dto/customer-xhr.dto';

@Injectable()
export class UvDeskEndpointsService {
  /**
   * @param {Object} options
   * @param {Object} options.body
   * @param {Object} options.headers
   * @return {Object}
   */
  createTicketEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/v1/ticket`,
      params: null,
      body: options.body,
      headers: options.headers,
    };
  }
  /**
   * @param {Object} options
   * @param {Object} options.params
   * @param {Object} options.headers
   * @return {Object}
   */
  getListOfTicketsEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/api/v1/tickets`,
      params: options.params,
      body: null,
      headers: options.headers,
    };
  }
  /**
   * @param {Object} options
   * @param {Object} options.urlParams
   * @param {Object} options.headers
   * @return {Object}
   */
  getTicketEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/api/v1/ticket/${options.urlParams.ticketId}`,
      params: null,
      body: null,
      headers: options.headers,
    };
  }
  /**
   * @param {Object} options
   * @param {Object} options.urlParams
   * @param {Object} options.body
   * @param {Object} options.headers
   * @return {Object}
   */
  replyTicketEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/v1/ticket/${options.urlParams.ticketId}/thread`,
      params: null,
      body: options.body,
      headers: options.headers,
    };
  }
  /**
   * @param {Object} options
   * @param {Object} options.urlParams
   * @param {Object} options.body
   * @param {Object} options.headers
   * @return {Object}
   */
  updateTicketEndpoint(options?: any) {
    return {
      method: 'patch',
      resource: `/api/v1/ticket/${options.urlParams.ticketId}`,
      params: null,
      body: options.body,
      headers: options.headers,
    };
  }

  loginEndpoint(options: AdminPanelLoginDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/en/member/login`,
      params: null,
      body: options.body,
      headers: {
        'Content-Type': 'multipart/form-data',
        Host: 'support.aradcloud.com',
        Connection: 'keep-alive',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      },
      additionalConfig: options.additionalConfigs,
    };
  }

  updateUserProfileEndpoint(
    options: UpdateCustomerProfileDto,
  ): EndpointInterface {
    return {
      method: 'post',
      resource: `/en/member/customer/${options.urlParams.customerId}`,
      params: null,
      body: options.body,
      headers: {
        'Content-Type': 'multipart/form-data',
        Host: 'support.aradcloud.com',
        Connection: 'keep-alive',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        ...options.headers,
      },
      additionalConfig: options.additionalConfigs,
    };
  }

  customerXhr(options: CustomerXhrDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/en/member/customers/xhr`,
      params: options.params,
      body: null,
      headers: {
        Host: 'support.aradcloud.com',
        Connection: 'keep-alive',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
      additionalConfig: options.additionalConfigs,
    };
  }
}
