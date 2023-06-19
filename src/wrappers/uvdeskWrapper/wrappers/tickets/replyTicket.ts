const UvDeskWrapper = require('../../uvdeskWrapper');
const uvDeskConfig = require('../../uvdeskConfig.json');

export async function replyTicket(
  ticketId,
  message,
  actAsType,
  threadType,
  email,
  to = null,
) {
  const ticket = await new UvDeskWrapper().posts('ticket.replyTicket', {
    body: {
      message,
      to,
      actAsType,
      actAsEmail: email,
      threadType,
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

module.exports = replyTicket;
