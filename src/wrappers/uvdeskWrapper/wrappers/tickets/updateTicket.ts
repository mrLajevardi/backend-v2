import { UvDeskWrapper } from '../../uvdeskWrapper';
import uvDeskConfig from '../../uvdeskConfig';

export async function updateTicket(property, value, ticketId) {
  const ticket = await new UvDeskWrapper().posts('ticket.updateTicket', {
    body: {
      property,
      value,
    },
    headers: {
      Authorization: uvDeskConfig.accessToken,
    },
    urlParams: {
      ticketId,
    },
  });
  return ticket.data;
}

