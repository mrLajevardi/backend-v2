import { createTicketEndpoint } from './createTicketEndpoint';
import { getListOfTicketsEndpoint } from './getListOfTicketsEndpoint';
import { getTicketEndpoint } from './getTicketEndpoint';
import { replyTicketEndpoint } from './replyTicketEndpoint';
import { updateTicketEndpoint } from './updateTicketEndpoint';

export const ticketEndpoints = {
  createTicket: createTicketEndpoint,
  getListOfTickets: getListOfTicketsEndpoint,
  replyTicket: replyTicketEndpoint,
  updateTicket: updateTicketEndpoint,
  getTicket: getTicketEndpoint,
};

