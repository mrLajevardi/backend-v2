import { UvDeskWrapper } from '../../uvdeskWrapper';
import uvDeskConfig from '../../uvdeskConfig';

export async function getTicket(ticketId) {
  const ticket = await new UvDeskWrapper().posts('ticket.getTicket', {
    headers: {
      Authorization: uvDeskConfig.accessToken,
    },
    urlParams: {
      ticketId,
    },
  });
  return ticket.data;
}
