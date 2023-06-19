const UvDeskWrapper = require('../../uvdeskWrapper');
const uvDeskConfig = require('../../uvdeskConfig.json');

export async function getListOfTickets(params) {
  const ticket = await new UvDeskWrapper().posts('ticket.getListOfTickets', {
    params,
    headers: {
      Authorization: uvDeskConfig.accessToken,
    },
  });
  return ticket.data;
}

module.exports = getListOfTickets;
