const https = require('https');
const Wrapper = require('../wrapper');
const {baseUrl} = require('../wrapper');
const ticketEndpoints = require('./endpoints/tickets/ticketEndpoints');
/**
 ** this wrapper directly send request to vcloud server
 */
class UvDeskWrapper extends Wrapper {
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

module.exports = UvDeskWrapper;
