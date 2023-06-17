const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
const {isEmpty} = require('../../../../utils/helpers');
const HttpExceptions = require('../../../../exceptions/httpExceptions');

/**
 * get dns forwarder lists
 * @param {String} authToken
 * @param {String} edgeName
 * @return {Promise}
 */

async function getDhcpForwarder(authToken, edgeName) {
  const gateway = await getEdgeGateway(authToken);

  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new HttpExceptions().noIpIsAssigned());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
      .id;

  const dhcpForwarder = await new VcloudWrapper().posts(
      'user.edgeGateway.getDhcpForwarder',
      {
        headers: {Authorization: `Bearer ${authToken}`},
        urlParams: {gatewayId},
      },
  );
  return Promise.resolve(dhcpForwarder.data);
}
module.exports = getDhcpForwarder;
