const UvDeskWrapper = require('../../uvdeskWrapper');
const uvDeskConfig = require('../../uvdeskConfig.json');

export async function updateTicket(property, value, ticketId) {
  const ticket = await new UvDeskWrapper().posts('ticket.updateTicket', {
    body: {
      property,
      value,
    },
    headers: {
      'Authorization': uvDeskConfig.accessToken,
    },
    urlParams: {
      ticketId,
    },
  });
  return ticket.data;
}

module.exports = updateTicket;
