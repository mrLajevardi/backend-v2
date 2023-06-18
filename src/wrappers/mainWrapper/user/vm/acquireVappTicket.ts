const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 *
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
export function userAcquireVappTicket(authToken, vAppId) {
  const ticket = new VcloudWrapper().posts('user.vm.acquireVmTicket', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {vmId: vAppId},
    body: {},
  });
  return ticket;
};

module.exports = userAcquireVappTicket;
