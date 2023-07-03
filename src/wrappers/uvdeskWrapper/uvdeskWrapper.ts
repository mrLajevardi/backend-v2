import { Wrapper } from '../wrapper';
import { ticketEndpoints } from './endpoints/tickets/ticketEndpoints';
/**
 ** this wrapper directly send request to vcloud server
 */
export class UvDeskWrapper extends Wrapper {
  /**
   * initialize endpoints object
   */
  constructor() {
    const httpsAgent = null;
    const endPoints = {
      ticket: ticketEndpoints,
    };
    const baseUrl = 'http://172.20.51.14/public/api/v1';
    super(httpsAgent, endPoints, baseUrl, 'uvdesk');
  }
}
