const createTicketEndpoint = require('./createTicketEndpoint');
const getListOfTicketsEndpoint = require('./getListOfTicketsEndpoint');
const getTicketEndpoint = require('./getTicketEndpoint');
const replyTicketEndpoint = require('./replyTicketEndpoint');
const updateTicketEndpoint = require('./updateTicketEndpoint');

export const ticketEndpoints = {
  createTicket: createTicketEndpoint,
  getListOfTickets: getListOfTicketsEndpoint,
  replyTicket: replyTicketEndpoint,
  updateTicket: updateTicketEndpoint,
  getTicket: getTicketEndpoint,
};


module.exports = ticketEndpoints;
