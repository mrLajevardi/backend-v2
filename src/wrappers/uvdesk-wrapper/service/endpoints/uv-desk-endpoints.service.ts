import { Injectable } from '@nestjs/common';

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
      resource: `/ticket`,
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
      resource: `/tickets`,
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
      resource: `/ticket/${options.urlParams.ticketId}`,
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
      resource: `/ticket/${options.urlParams.ticketId}/thread`,
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
      resource: `/ticket/${options.urlParams.ticketId}`,
      params: null,
      body: options.body,
      headers: options.headers,
    };
  }
}
