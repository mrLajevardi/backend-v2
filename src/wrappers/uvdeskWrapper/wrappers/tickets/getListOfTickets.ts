import { UvDeskWrapper } from '../../uvdeskWrapper';
import uvDeskConfig from '../../uvdeskConfig';

export async function getListOfTickets(params) {
  const ticket = await new UvDeskWrapper().posts('ticket.getListOfTickets', {
    params,
    headers: {
      Authorization: uvDeskConfig.accessToken,
    },
  });
  return ticket.data;
}

