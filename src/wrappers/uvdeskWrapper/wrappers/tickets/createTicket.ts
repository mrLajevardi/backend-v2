import { UvDeskWrapper } from '../../uvdeskWrapper';
import uvDeskConfig from '../../uvdeskConfig';

export async function createTicket(
  message,
  actAsType,
  actAsEmail,
  name,
  subject,
  from,
) {
  const ticket = await new UvDeskWrapper().posts('ticket.createTicket', {
    body: {
      message,
      actAsEmail,
      actAsType,
      name,
      subject,
      from,
    },
    headers: {
      Authorization: uvDeskConfig.accessToken,
    },
  });
  return ticket.data;
}

