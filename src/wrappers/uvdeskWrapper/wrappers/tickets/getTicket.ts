const UvDeskWrapper = require('../../uvdeskWrapper');
const uvDeskConfig = require('../../uvdeskConfig.json');

export async function getTicket(ticketId) {
  const ticket = await new UvDeskWrapper().posts('ticket.getTicket', {
    headers: {
      'Authorization': uvDeskConfig.accessToken,
    },
    urlParams: {
      ticketId,
    },
  });
  return ticket.data;
}

module.exports = getTicket;
